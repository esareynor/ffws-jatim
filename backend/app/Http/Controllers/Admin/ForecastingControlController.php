<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasSensor;
use App\Models\MasModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ForecastingControlController extends Controller
{
    /**
     * Display a listing of sensors with forecasting control
     */
    public function index(Request $request)
    {
        try {
            $query = MasSensor::with(['device', 'masModel'])
                ->where('parameter', 'water_level'); // Only water level sensors can do forecasting

            // Apply filters
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            if ($request->filled('forecasting_status')) {
                $query->where('forecasting_status', $request->forecasting_status);
            }

            if ($request->filled('mas_model_code')) {
                $query->where('mas_model_code', $request->mas_model_code);
            }

            $sensors = $query->orderBy('description')->paginate(15);

            // Get models for filter
            $models = MasModel::select('code', 'name', 'type')
                ->orderBy('name')
                ->get();

            // Forecasting status options
            $statusOptions = [
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'paused', 'label' => 'Paused'],
                ['value' => 'stopped', 'label' => 'Stopped'],
                ['value' => 'inactive', 'label' => 'Inactive']
            ];

            // Filter configuration
            $filterConfig = [
                [
                    'name' => 'search',
                    'type' => 'text',
                    'placeholder' => 'Cari sensor...',
                    'value' => $request->search
                ],
                [
                    'name' => 'forecasting_status',
                    'type' => 'select',
                    'placeholder' => 'Status Forecasting',
                    'options' => $statusOptions,
                    'value' => $request->forecasting_status
                ],
                [
                    'name' => 'mas_model_code',
                    'type' => 'select',
                    'placeholder' => 'Model',
                    'options' => $models->map(fn($m) => [
                        'value' => $m->code,
                        'label' => $m->name . ' (' . $m->type . ')'
                    ])->toArray(),
                    'value' => $request->mas_model_code
                ]
            ];

            // Table headers
            $tableHeaders = [
                ['key' => 'description', 'label' => 'Nama Sensor', 'sortable' => true],
                ['key' => 'code', 'label' => 'Kode Sensor', 'sortable' => true],
                ['key' => 'model_name', 'label' => 'Nama Model', 'sortable' => false],
                ['key' => 'forecasting_status', 'label' => 'Status Forecasting', 'format' => 'badge', 'sortable' => true],
                ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions', 'sortable' => false]
            ];

            // Transform data for table - keep paginator structure
            $sensors->getCollection()->transform(function ($sensor) {
                $status = $sensor->forecasting_status ?? 'inactive';

                return (object) [
                    'id' => $sensor->id,
                    'code' => $sensor->code,
                    'description' => $sensor->description,
                    'model_name' => $sensor->masModel ? $sensor->masModel->name : '-',
                    'model_code' => $sensor->mas_model_code,
                    'forecasting_status' => $status,
                    'forecasting_status_badge' => $this->getStatusBadge($status),
                    'actions' => $this->getActionButtons($sensor->id, $status),
                ];
            });

            return view('admin.forecasting_control.index', [
                'rows' => $sensors,
                'tableHeaders' => $tableHeaders,
                'filterConfig' => $filterConfig,
                'pagination' => null // Already included in $sensors paginator
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching forecasting control: ' . $e->getMessage());
            return view('admin.forecasting_control.index', [
                'rows' => [],
                'tableHeaders' => [],
                'filterConfig' => [],
                'pagination' => null
            ])->with('error', 'Failed to load forecasting control');
        }
    }

    /**
     * Show the form for editing forecasting control
     */
    public function edit($id)
    {
        try {
            $sensor = MasSensor::with(['device', 'masModel'])->findOrFail($id);

            // Get all models for dropdown
            $models = MasModel::select('code', 'name', 'type')
                ->orderBy('name')
                ->get()
                ->map(fn($m) => [
                    'value' => $m->code,
                    'label' => $m->name . ' (' . $m->type . ')'
                ]);

            // Status options
            $statusOptions = [
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'paused', 'label' => 'Paused'],
                ['value' => 'stopped', 'label' => 'Stopped'],
                ['value' => 'inactive', 'label' => 'Inactive']
            ];

            return view('admin.forecasting_control.edit', [
                'sensor' => $sensor,
                'models' => $models,
                'statusOptions' => $statusOptions
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading edit form: ' . $e->getMessage());
            return back()->with('error', 'Sensor tidak ditemukan');
        }
    }

    /**
     * Update forecasting control
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'mas_model_code' => 'required|exists:mas_models,code',
            'forecasting_status' => 'required|in:active,paused,stopped,inactive'
        ]);

        try {
            DB::beginTransaction();

            $sensor = MasSensor::findOrFail($id);
            $sensor->update($validated);

            DB::commit();

            return redirect()->route('admin.forecasting-control.index')
                ->with('success', 'Forecasting control berhasil diupdate');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating forecasting control: ' . $e->getMessage());
            return back()->withInput()->with('error', 'Gagal mengupdate forecasting control');
        }
    }

    /**
     * Update status via AJAX (for quick actions: start, pause, stop)
     */
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'forecasting_status' => 'required|in:active,paused,stopped,inactive'
        ]);

        try {
            $sensor = MasSensor::findOrFail($id);

            // Check if model is assigned
            if (!$sensor->mas_model_code && $validated['forecasting_status'] === 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak bisa mengaktifkan forecasting. Model belum dipilih.'
                ], 400);
            }

            $sensor->forecasting_status = $validated['forecasting_status'];
            $sensor->save();

            return response()->json([
                'success' => true,
                'message' => 'Status forecasting berhasil diupdate',
                'data' => [
                    'forecasting_status' => $sensor->forecasting_status,
                    'badge' => $this->getStatusBadge($sensor->forecasting_status)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating forecasting status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate status forecasting'
            ], 500);
        }
    }

    /**
     * Get status badge HTML
     */
    private function getStatusBadge($status)
    {
        $badges = [
            'active' => '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</span>',
            'paused' => '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Paused</span>',
            'stopped' => '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Stopped</span>',
            'inactive' => '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Inactive</span>',
        ];

        return $badges[$status] ?? $badges['inactive'];
    }

    /**
     * Get action buttons HTML
     */
    private function getActionButtons($sensorId, $status)
    {
        $buttons = [];

        // Start button - show if not active
        if ($status !== 'active') {
            $buttons[] = [
                'label' => '<i class="fas fa-play"></i>',
                'url' => 'javascript:void(0)',
                'class' => 'btn-success',
                'onclick' => "updateForecastingStatus({$sensorId}, 'active')",
                'title' => 'Start Forecasting'
            ];
        }

        // Pause button - show if active
        if ($status === 'active') {
            $buttons[] = [
                'label' => '<i class="fas fa-pause"></i>',
                'url' => 'javascript:void(0)',
                'class' => 'btn-warning',
                'onclick' => "updateForecastingStatus({$sensorId}, 'paused')",
                'title' => 'Pause Forecasting'
            ];
        }

        // Stop button - show if active or paused
        if ($status === 'active' || $status === 'paused') {
            $buttons[] = [
                'label' => '<i class="fas fa-stop"></i>',
                'url' => 'javascript:void(0)',
                'class' => 'btn-danger',
                'onclick' => "updateForecastingStatus({$sensorId}, 'stopped')",
                'title' => 'Stop Forecasting'
            ];
        }

        // Edit button - always show
        $buttons[] = [
            'label' => '<i class="fas fa-edit"></i>',
            'url' => route('admin.forecasting-control.edit', $sensorId),
            'class' => 'btn-primary',
            'title' => 'Edit'
        ];

        return $buttons;
    }
}
