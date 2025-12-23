<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CalculatedDischarge;
use App\Models\MasSensor;
use App\Models\RatingCurve;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CalculatedDischargeController extends Controller
{
    /**
     * Display a listing of calculated discharges
     */
    public function index(Request $request)
    {
        try {
            $query = CalculatedDischarge::with(['sensor', 'ratingCurve']);

            // Apply filters
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->whereHas('sensor', function($sq) use ($search) {
                        $sq->where('description', 'like', "%{$search}%")
                           ->orWhere('code', 'like', "%{$search}%");
                    })
                    ->orWhere('discharge', 'like', "%{$search}%");
                });
            }

            if ($request->filled('mas_sensor_code')) {
                $query->where('mas_sensor_code', $request->mas_sensor_code);
            }

            if ($request->filled('date_from')) {
                $query->whereDate('calculated_at', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->whereDate('calculated_at', '<=', $request->date_to);
            }

            $discharges = $query->orderBy('calculated_at', 'desc')->paginate(15);

            // Get sensors for filter
            $sensors = MasSensor::where('parameter', 'water_level')
                ->where('status', 'active')
                ->select('code', 'description')
                ->orderBy('description')
                ->get();

            // Filter configuration
            $filterConfig = [
                [
                    'name' => 'search',
                    'type' => 'text',
                    'placeholder' => 'Cari sensor atau discharge...',
                    'value' => $request->search
                ],
                [
                    'name' => 'mas_sensor_code',
                    'type' => 'select',
                    'placeholder' => 'Sensor',
                    'options' => $sensors->map(fn($s) => [
                        'value' => $s->code,
                        'label' => $s->description . ' (' . $s->code . ')'
                    ])->toArray(),
                    'value' => $request->mas_sensor_code
                ],
                [
                    'name' => 'date_from',
                    'type' => 'date',
                    'placeholder' => 'Dari Tanggal',
                    'value' => $request->date_from
                ],
                [
                    'name' => 'date_to',
                    'type' => 'date',
                    'placeholder' => 'Sampai Tanggal',
                    'value' => $request->date_to
                ]
            ];

            // Table headers
            $tableHeaders = [
                ['key' => 'calculated_at', 'label' => 'Waktu', 'sortable' => true],
                ['key' => 'sensor_name', 'label' => 'Sensor', 'sortable' => false],
                ['key' => 'water_level', 'label' => 'Tinggi Muka Air (m)', 'sortable' => true],
                ['key' => 'discharge', 'label' => 'Debit (m³/s)', 'sortable' => true],
                ['key' => 'rating_curve', 'label' => 'Rating Curve', 'sortable' => false],
                ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions', 'sortable' => false]
            ];

            // Transform data for table
            $discharges->getCollection()->transform(function ($discharge) {
                return (object) [
                    'id' => $discharge->id,
                    'calculated_at' => $discharge->calculated_at->format('d/m/Y H:i'),
                    'sensor_name' => $discharge->sensor ? $discharge->sensor->description : '-',
                    'sensor_code' => $discharge->mas_sensor_code,
                    'water_level' => number_format($discharge->water_level, 2),
                    'discharge' => number_format($discharge->discharge, 2),
                    'rating_curve' => $discharge->ratingCurve ? $discharge->ratingCurve->code : '-',
                    'actions' => [
                        [
                            'label' => '<i class="fas fa-eye"></i>',
                            'url' => route('admin.calculated-discharges.show', $discharge->id),
                            'class' => 'btn-info',
                            'title' => 'Detail'
                        ],
                        [
                            'label' => '<i class="fas fa-edit"></i>',
                            'url' => route('admin.calculated-discharges.edit', $discharge->id),
                            'class' => 'btn-warning',
                            'title' => 'Edit'
                        ],
                        [
                            'label' => '<i class="fas fa-trash"></i>',
                            'url' => route('admin.calculated-discharges.destroy', $discharge->id),
                            'class' => 'btn-danger',
                            'method' => 'DELETE',
                            'confirm' => 'Apakah Anda yakin ingin menghapus data ini?',
                            'title' => 'Hapus'
                        ]
                    ]
                ];
            });

            return view('admin.calculated_discharges.index', [
                'rows' => $discharges,
                'tableHeaders' => $tableHeaders,
                'filterConfig' => $filterConfig,
                'pagination' => null
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching calculated discharges: ' . $e->getMessage());
            return view('admin.calculated_discharges.index', [
                'rows' => [],
                'tableHeaders' => [],
                'filterConfig' => [],
                'pagination' => null
            ])->with('error', 'Failed to load calculated discharges');
        }
    }

    /**
     * Show the form for creating a new calculated discharge
     */
    public function create()
    {
        try {
            $sensors = MasSensor::where('parameter', 'water_level')
                ->where('status', 'active')
                ->select('code', 'description')
                ->orderBy('description')
                ->get();

            return view('admin.calculated_discharges.create', [
                'sensors' => $sensors
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading create form: ' . $e->getMessage());
            return back()->with('error', 'Gagal memuat form');
        }
    }

    /**
     * Store a newly created calculated discharge
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mas_sensor_code' => 'required|exists:mas_sensors,code',
            'rating_curve_code' => 'required|exists:rating_curves,code',
            'water_level' => 'required|numeric|min:0',
            'discharge' => 'required|numeric|min:0',
            'calculated_at' => 'required|date'
        ]);

        try {
            DB::beginTransaction();

            CalculatedDischarge::create($validated);

            DB::commit();

            return redirect()->route('admin.calculated-discharges.index')
                ->with('success', 'Data berhasil disimpan');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing discharge: ' . $e->getMessage());
            return back()->with('error', 'Gagal menyimpan data')->withInput();
        }
    }

    /**
     * Display the specified calculated discharge
     */
    public function show($id)
    {
        try {
            $discharge = CalculatedDischarge::with(['sensor.device', 'ratingCurve'])->findOrFail($id);

            return view('admin.calculated_discharges.show', [
                'discharge' => $discharge
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading discharge detail: ' . $e->getMessage());
            return back()->with('error', 'Data tidak ditemukan');
        }
    }

    /**
     * Show the form for editing the specified calculated discharge
     */
    public function edit($id)
    {
        try {
            $discharge = CalculatedDischarge::with(['sensor'])->findOrFail($id);

            $ratingCurves = RatingCurve::where('mas_sensor_code', $discharge->mas_sensor_code)
                ->orderBy('effective_date', 'desc')
                ->get();

            return view('admin.calculated_discharges.edit', [
                'discharge' => $discharge,
                'ratingCurves' => $ratingCurves
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading edit form: ' . $e->getMessage());
            return back()->with('error', 'Data tidak ditemukan');
        }
    }

    /**
     * Update the specified calculated discharge
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'rating_curve_code' => 'required|exists:rating_curves,code',
            'water_level' => 'required|numeric|min:0',
            'discharge' => 'required|numeric|min:0',
            'calculated_at' => 'required|date'
        ]);

        try {
            DB::beginTransaction();

            $discharge = CalculatedDischarge::findOrFail($id);
            $discharge->update($validated);

            DB::commit();

            return redirect()->route('admin.calculated-discharges.show', $id)
                ->with('success', 'Data berhasil diupdate');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating discharge: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengupdate data')->withInput();
        }
    }

    /**
     * Remove the specified calculated discharge
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $discharge = CalculatedDischarge::findOrFail($id);
            $discharge->delete();

            DB::commit();

            return redirect()->route('admin.calculated-discharges.index')
                ->with('success', 'Data berhasil dihapus');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting discharge: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus data');
        }
    }

    /**
     * Recalculate discharge for a specific sensor and time range
     */
    public function recalculate(Request $request)
    {
        $validated = $request->validate([
            'mas_sensor_code' => 'required|exists:mas_sensors,code',
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from'
        ]);

        try {
            DB::beginTransaction();

            // Get rating curve for sensor
            $ratingCurve = RatingCurve::getActiveForSensor($validated['mas_sensor_code']);

            if (!$ratingCurve) {
                return back()->with('error', 'Rating curve tidak ditemukan untuk sensor ini');
            }

            // Get water level data in the time range
            $waterLevelData = \App\Models\DataActual::where('mas_sensor_code', $validated['mas_sensor_code'])
                ->whereBetween('received_at', [$validated['date_from'], $validated['date_to']])
                ->get();

            $recalculatedCount = 0;

            foreach ($waterLevelData as $data) {
                // Calculate discharge
                $discharge = $ratingCurve->calculateDischarge($data->water_level);

                // Update or create calculated discharge
                CalculatedDischarge::updateOrCreate(
                    [
                        'mas_sensor_code' => $validated['mas_sensor_code'],
                        'calculated_at' => $data->received_at
                    ],
                    [
                        'water_level' => $data->water_level,
                        'discharge' => $discharge,
                        'rating_curve_code' => $ratingCurve->code
                    ]
                );

                $recalculatedCount++;
            }

            DB::commit();

            return back()->with('success', "Berhasil menghitung ulang {$recalculatedCount} data discharge");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error recalculating discharge: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghitung ulang discharge');
        }
    }
}
