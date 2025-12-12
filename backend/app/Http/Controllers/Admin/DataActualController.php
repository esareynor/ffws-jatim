<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataActual;
use App\Models\MasSensor;
use App\Models\MasDevice;
use App\Models\MasRiverBasin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DataActualController extends Controller
{
    /**
     * Tampilkan daftar data actual
     */
    public function index(Request $request)
    {
        $query = DataActual::with(['sensor.device.riverBasin'])
            ->orderBy('received_at', 'desc');

        // Filter berdasarkan sensor (menggunakan sensor code)
        if ($request->filled('sensor_code')) {
            $query->where('mas_sensor_code', $request->sensor_code);
        }

        // Filter berdasarkan status threshold
        if ($request->filled('threshold_status')) {
            $query->where('threshold_status', $request->threshold_status);
        }

        // Filter berdasarkan tanggal
        if ($request->filled('date_from')) {
            $query->whereDate('received_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('received_at', '<=', $request->date_to);
        }

        // Filter berdasarkan river basin
        if ($request->filled('river_basin_code')) {
            $query->whereHas('sensor.device', function($q) use ($request) {
                $q->where('mas_river_basin_code', $request->river_basin_code);
            });
        }

        $dataActuals = $query->paginate(20);

        // Data untuk filter
        $sensors = MasSensor::with('device')->get();
        $riverBasins = MasRiverBasin::all();

        // Statistik
        $stats = [
            'total_data' => DataActual::count(),
            'safe_count' => DataActual::where('threshold_status', 'safe')->count(),
            'warning_count' => DataActual::where('threshold_status', 'warning')->count(),
            'danger_count' => DataActual::where('threshold_status', 'danger')->count(),
            'today_data' => DataActual::whereDate('received_at', today())->count(),
        ];

        // Prepare table data for component
        $tableHeaders = [
            ['key' => 'id', 'label' => 'ID'],
            ['key' => 'sensor', 'label' => 'Sensor', 'format' => 'sensor'],
            ['key' => 'parameter', 'label' => 'Parameter', 'format' => 'parameter'],
            ['key' => 'value', 'label' => 'Nilai', 'format' => 'value'],
            ['key' => 'threshold_status', 'label' => 'Status', 'format' => 'status'],
            ['key' => 'received_at', 'label' => 'Diterima', 'format' => 'date'],
            ['key' => 'location', 'label' => 'Lokasi'],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions']
        ];

        // Transform the paginated data to include formatted fields
        $dataActuals->getCollection()->transform(function($data) {
            $data->formatted_id = '#' . $data->id;
            $data->formatted_sensor = $data->mas_sensor_code;
            $data->formatted_sensor_device = $data->sensor->device->name ?? 'N/A';
            $data->formatted_parameter = $data->sensor->parameter ?? 'N/A';
            $data->formatted_parameter_unit = $data->sensor->unit ?? '';
            $data->formatted_value = number_format($data->value, 2);
            $data->formatted_threshold_status = $data->threshold_status;
            $data->formatted_received_at = $data->received_at->format('Y-m-d H:i:s');
            $data->formatted_location = $data->sensor->device->riverBasin->name ?? 'N/A';
            $data->formatted_actions = [
                [
                    'type' => 'detail',
                    'label' => 'Detail',
                    'url' => route('admin.data-actuals.show', $data),
                    'icon' => 'eye',
                    'color' => 'blue'
                ],
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => '#',
                    'icon' => 'pen',
                    'color' => 'gray',
                    'onclick' => 'openEditModal(' . $data->id . ')'
                ],
                [
                    'type' => 'hapus',
                    'label' => 'Hapus',
                    'url' => route('admin.data-actuals.destroy', $data),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE',
                    'confirm' => 'Data actual ini akan dihapus. Lanjutkan?'
                ]
            ];
            return $data;
        });

        return view('admin.data_actuals.index', compact(
            'dataActuals',
            'sensors',
            'riverBasins',
            'stats',
            'tableHeaders'
        ));
    }

    /**
     * Tampilkan form untuk membuat data actual baru
     */
    public function create()
    {
        $sensors = MasSensor::with('device.riverBasin')->get();

        return response()->json([
            'success' => true,
            'sensors' => $sensors->map(function($sensor) {
                return [
                    'id' => $sensor->id,
                    'sensor_code' => $sensor->code,
                    'parameter' => $sensor->parameter,
                    'unit' => $sensor->unit,
                    'device_name' => $sensor->device->name ?? 'N/A',
                    'river_basin' => $sensor->device->riverBasin->name ?? 'N/A'
                ];
            })
        ]);
    }

    /**
     * Simpan data actual baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'mas_sensor_id' => 'required|exists:mas_sensors,id',
            'value' => 'required|numeric',
            'received_at' => 'required|date',
            'threshold_status' => 'required|in:safe,warning,danger'
        ]);

        try {
            $sensor = MasSensor::findOrFail($request->mas_sensor_id);

            $dataActual = DataActual::create([
                'mas_sensor_id' => $request->mas_sensor_id,
                'mas_sensor_code' => $sensor->code,
                'value' => $request->value,
                'received_at' => $request->received_at,
                'threshold_status' => $request->threshold_status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data actual berhasil ditambahkan!',
                'data' => $dataActual
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan data actual: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tampilkan detail data actual
     */
    public function show(DataActual $dataActual)
    {
        $dataActual->load(['sensor.device.riverBasin']);

        // Data terkait dari sensor yang sama
        $relatedData = DataActual::where('mas_sensor_id', $dataActual->mas_sensor_id)
            ->where('id', '!=', $dataActual->id)
            ->orderBy('received_at', 'desc')
            ->limit(10)
            ->get();

        return view('admin.data_actuals.show', compact('dataActual', 'relatedData'));
    }

    /**
     * Tampilkan form untuk mengedit data actual
     */
    public function edit(DataActual $dataActual)
    {
        $sensors = MasSensor::with('device.riverBasin')->get();

        return response()->json([
            'success' => true,
            'dataActual' => [
                'id' => $dataActual->id,
                'mas_sensor_id' => $dataActual->mas_sensor_id,
                'value' => $dataActual->value,
                'received_at' => $dataActual->received_at->format('Y-m-d\TH:i'),
                'threshold_status' => $dataActual->threshold_status
            ],
            'sensors' => $sensors->map(function($sensor) {
                return [
                    'id' => $sensor->id,
                    'sensor_code' => $sensor->code,
                    'parameter' => $sensor->parameter,
                    'unit' => $sensor->unit,
                    'device_name' => $sensor->device->name ?? 'N/A',
                    'river_basin' => $sensor->device->riverBasin->name ?? 'N/A'
                ];
            })
        ]);
    }

    /**
     * Update data actual
     */
    public function update(Request $request, DataActual $dataActual)
    {
        $request->validate([
            'mas_sensor_id' => 'required|exists:mas_sensors,id',
            'value' => 'required|numeric',
            'received_at' => 'required|date',
            'threshold_status' => 'required|in:safe,warning,danger'
        ]);

        try {
            $sensor = MasSensor::findOrFail($request->mas_sensor_id);

            $dataActual->update([
                'mas_sensor_id' => $request->mas_sensor_id,
                'mas_sensor_code' => $sensor->sensor_code,
                'value' => $request->value,
                'received_at' => $request->received_at,
                'threshold_status' => $request->threshold_status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data actual berhasil diperbarui!',
                'data' => $dataActual
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data actual: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hapus data actual
     */
    public function destroy(DataActual $dataActual)
    {
        try {
            $dataActual->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data actual berhasil dihapus!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data actual: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * API untuk mendapatkan data chart
     */
    public function chartData(Request $request)
    {
        $sensorId = $request->get('sensor_id');
        $days = $request->get('days', 7);

        $query = DataActual::select(
                DB::raw('DATE(received_at) as date'),
                DB::raw('AVG(value) as avg_value'),
                DB::raw('MAX(value) as max_value'),
                DB::raw('MIN(value) as min_value'),
                'threshold_status'
            )
            ->where('received_at', '>=', now()->subDays($days))
            ->groupBy('date', 'threshold_status');

        if ($sensorId) {
            $query->where('mas_sensor_id', $sensorId);
        }

        $data = $query->get();

        return response()->json($data);
    }

    /**
     * Export data ke CSV
     */
    public function export(Request $request)
    {
        $query = DataActual::with(['sensor.device.riverBasin']);

        // Apply same filters as index
        if ($request->filled('sensor_id')) {
            $query->where('mas_sensor_id', $request->sensor_id);
        }

        if ($request->filled('threshold_status')) {
            $query->where('threshold_status', $request->threshold_status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('received_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('received_at', '<=', $request->date_to);
        }

        $data = $query->orderBy('received_at', 'desc')->get();

        $filename = 'data_actuals_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');

            // Header CSV
            fputcsv($file, [
                'ID',
                'Sensor Code',
                'Parameter',
                'Value',
                'Unit',
                'Received At',
                'Threshold Status',
                'Device Name',
                'River Basin',
                'Location'
            ]);

            // Data CSV
            foreach ($data as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->mas_sensor_code,
                    $row->sensor->parameter ?? '',
                    $row->value,
                    $row->sensor->unit ?? '',
                    $row->received_at->format('Y-m-d H:i:s'),
                    $row->threshold_status,
                    $row->sensor->device->name ?? '',
                    $row->sensor->device->riverBasin->name ?? '',
                    $row->sensor->device->latitude . ', ' . $row->sensor->device->longitude
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
