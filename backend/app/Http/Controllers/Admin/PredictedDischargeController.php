<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PredictedCalculatedDischarge;
use App\Models\MasSensor;
use App\Models\RatingCurve;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PredictedDischargeController extends Controller
{
    /**
     * Display a listing of predicted discharges
     */
    public function index(Request $request)
    {
        try {
            $query = PredictedCalculatedDischarge::with(['sensor', 'ratingCurve']);

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
                $query->whereDate('predicted_at', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->whereDate('predicted_at', '<=', $request->date_to);
            }

            $predictions = $query->orderBy('predicted_at', 'desc')->paginate(15);

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
                ['key' => 'predicted_at', 'label' => 'Waktu Prediksi', 'sortable' => true],
                ['key' => 'sensor_name', 'label' => 'Sensor', 'sortable' => false],
                ['key' => 'water_level', 'label' => 'Tinggi Muka Air Prediksi (m)', 'sortable' => true],
                ['key' => 'discharge', 'label' => 'Debit Prediksi (m³/s)', 'sortable' => true],
                ['key' => 'rating_curve', 'label' => 'Rating Curve', 'sortable' => false],
                ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions', 'sortable' => false]
            ];

            // Transform data for table
            $predictions->getCollection()->transform(function ($prediction) {
                return (object) [
                    'id' => $prediction->id,
                    'predicted_at' => $prediction->predicted_at->format('d/m/Y H:i'),
                    'sensor_name' => $prediction->sensor ? $prediction->sensor->description : '-',
                    'sensor_code' => $prediction->mas_sensor_code,
                    'water_level' => number_format($prediction->water_level, 2),
                    'discharge' => number_format($prediction->discharge, 2),
                    'rating_curve' => $prediction->ratingCurve ? $prediction->ratingCurve->code : '-',
                    'actions' => [
                        [
                            'label' => '<i class="fas fa-eye"></i>',
                            'url' => route('admin.predicted-discharges.show', $prediction->id),
                            'class' => 'btn-info',
                            'title' => 'Detail'
                        ],
                        [
                            'label' => '<i class="fas fa-edit"></i>',
                            'url' => route('admin.predicted-discharges.edit', $prediction->id),
                            'class' => 'btn-warning',
                            'title' => 'Edit'
                        ],
                        [
                            'label' => '<i class="fas fa-trash"></i>',
                            'url' => route('admin.predicted-discharges.destroy', $prediction->id),
                            'class' => 'btn-danger',
                            'method' => 'DELETE',
                            'confirm' => 'Apakah Anda yakin ingin menghapus data ini?',
                            'title' => 'Hapus'
                        ]
                    ]
                ];
            });

            return view('admin.predicted_discharges.index', [
                'rows' => $predictions,
                'tableHeaders' => $tableHeaders,
                'filterConfig' => $filterConfig,
                'pagination' => null
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching predicted discharges: ' . $e->getMessage());
            return view('admin.predicted_discharges.index', [
                'rows' => [],
                'tableHeaders' => [],
                'filterConfig' => [],
                'pagination' => null
            ])->with('error', 'Failed to load predicted discharges');
        }
    }

    /**
     * Show the form for creating a new predicted discharge
     */
    public function create()
    {
        try {
            $sensors = MasSensor::where('parameter', 'water_level')
                ->where('status', 'active')
                ->select('code', 'description')
                ->orderBy('description')
                ->get();

            return view('admin.predicted_discharges.create', [
                'sensors' => $sensors
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading create form: ' . $e->getMessage());
            return back()->with('error', 'Gagal memuat form');
        }
    }

    /**
     * Store a newly created predicted discharge
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mas_sensor_code' => 'required|exists:mas_sensors,code',
            'rating_curve_code' => 'required|exists:rating_curves,code',
            'water_level' => 'required|numeric|min:0',
            'discharge' => 'required|numeric|min:0',
            'predicted_at' => 'required|date'
        ]);

        try {
            DB::beginTransaction();

            PredictedCalculatedDischarge::create($validated);

            DB::commit();

            return redirect()->route('admin.predicted-discharges.index')
                ->with('success', 'Data prediksi berhasil disimpan');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing prediction: ' . $e->getMessage());
            return back()->with('error', 'Gagal menyimpan data')->withInput();
        }
    }

    /**
     * Display the specified predicted discharge
     */
    public function show($id)
    {
        try {
            $prediction = PredictedCalculatedDischarge::with(['sensor.device', 'ratingCurve'])->findOrFail($id);

            return view('admin.predicted_discharges.show', [
                'prediction' => $prediction
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading prediction detail: ' . $e->getMessage());
            return back()->with('error', 'Data tidak ditemukan');
        }
    }

    /**
     * Show the form for editing the specified predicted discharge
     */
    public function edit($id)
    {
        try {
            $prediction = PredictedCalculatedDischarge::with(['sensor'])->findOrFail($id);

            $ratingCurves = RatingCurve::where('mas_sensor_code', $prediction->mas_sensor_code)
                ->orderBy('effective_date', 'desc')
                ->get();

            return view('admin.predicted_discharges.edit', [
                'prediction' => $prediction,
                'ratingCurves' => $ratingCurves
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading edit form: ' . $e->getMessage());
            return back()->with('error', 'Data tidak ditemukan');
        }
    }

    /**
     * Update the specified predicted discharge
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'rating_curve_code' => 'required|exists:rating_curves,code',
            'water_level' => 'required|numeric|min:0',
            'discharge' => 'required|numeric|min:0',
            'predicted_at' => 'required|date'
        ]);

        try {
            DB::beginTransaction();

            $prediction = PredictedCalculatedDischarge::findOrFail($id);
            $prediction->update($validated);

            DB::commit();

            return redirect()->route('admin.predicted-discharges.show', $id)
                ->with('success', 'Data prediksi berhasil diupdate');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating prediction: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengupdate data')->withInput();
        }
    }

    /**
     * Remove the specified predicted discharge
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $prediction = PredictedCalculatedDischarge::findOrFail($id);
            $prediction->delete();

            DB::commit();

            return redirect()->route('admin.predicted-discharges.index')
                ->with('success', 'Data berhasil dihapus');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting prediction: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus data');
        }
    }
}
