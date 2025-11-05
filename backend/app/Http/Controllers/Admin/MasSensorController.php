<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasSensor;
use App\Models\MasDevice;
use App\Models\MasModel;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class MasSensorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): View
    {
        $query = MasSensor::with(['device', 'masModel']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('device', function ($deviceQuery) use ($search) {
                        $deviceQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by parameter
        if ($request->filled('parameter')) {
            $query->where('parameter', $request->parameter);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 10);
        $sensors = $query->orderBy('created_at', 'desc')->paginate($perPage)->appends(request()->query());

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'code', 'label' => 'Kode Sensor', 'sortable' => true],
            ['key' => 'formatted_device_name', 'label' => 'Device'],
            ['key' => 'formatted_parameter', 'label' => 'Parameter'],
            ['key' => 'unit', 'label' => 'Unit'],
            ['key' => 'formatted_thresholds', 'label' => 'Threshold'],
            ['key' => 'status', 'label' => 'Status', 'format' => 'status'],
            ['key' => 'last_seen', 'label' => 'Last Seen', 'format' => 'date'],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions']
        ];

        // Transform paginator items to include formatted data
        $sensors->getCollection()->transform(function ($sensor) {
            $sensor->formatted_parameter = MasSensor::getParameterOptions()[$sensor->parameter] ?? $sensor->parameter;
            $sensor->formatted_thresholds = $this->formatThresholds($sensor);
            $sensor->formatted_device_name = $sensor->device->name ?? '-';
            $sensor->actions = [
                [
                    'type' => 'view',
                    'label' => 'Detail',
                    'url' => route('admin.sensors.show', $sensor),
                    'icon' => 'eye',
                    'color' => 'blue'
                ],
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => route('admin.sensors.edit', $sensor),
                    'icon' => 'edit',
                    'color' => 'indigo'
                ],
                [
                    'type' => 'delete',
                    'label' => 'Hapus',
                    'url' => route('admin.sensors.destroy', $sensor),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE',
                    'confirm' => 'Apakah Anda yakin ingin menghapus sensor ini?'
                ]
            ];
            return $sensor;
        });


        $parameterOptions = MasSensor::getParameterOptions();
        $statusOptions = MasSensor::getStatusOptions();

        return view('admin.mas_sensors.index', compact('sensors', 'tableHeaders', 'parameterOptions', 'statusOptions'));
    }

    private function formatThresholds($sensor)
    {
        $thresholds = [];
        if ($sensor->threshold_safe)
            $thresholds[] = "Safe: {$sensor->threshold_safe}";
        if ($sensor->threshold_warning)
            $thresholds[] = "Warning: {$sensor->threshold_warning}";
        if ($sensor->threshold_danger)
            $thresholds[] = "Danger: {$sensor->threshold_danger}";

        return empty($thresholds) ? '-' : implode(', ', $thresholds);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        $devices = MasDevice::where('status', 'active')->get();
        $models = MasModel::all();
        $parameterOptions = MasSensor::getParameterOptions();
        $statusOptions = MasSensor::getStatusOptions();

        return view('admin.mas_sensors.create', compact('devices', 'models', 'parameterOptions', 'statusOptions'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mas_device_code' => 'required|string|max:100|exists:mas_devices,code',
            'code' => 'required|string|max:100|unique:mas_sensors,code',
            'parameter' => 'required|in:water_level,rainfall',
            'unit' => 'required|string|max:50',
            'description' => 'nullable|string|max:500',
            'mas_model_code' => 'nullable|string|max:100|exists:mas_models,code',
            'threshold_safe' => 'nullable|numeric|min:0',
            'threshold_warning' => 'nullable|numeric|min:0',
            'threshold_danger' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'forecasting_status' => 'nullable|in:stopped,running,paused',
            'is_active' => 'nullable|boolean',
            'last_seen' => 'nullable|date',
        ]);

        MasSensor::create($validated);

        return redirect()->route('admin.sensors.index')
            ->with('success', 'Sensor berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MasSensor $sensor): View
    {
        $sensor->load(['device', 'masModel']);
        $parameterOptions = MasSensor::getParameterOptions();
        $statusOptions = MasSensor::getStatusOptions();

        return view('admin.mas_sensors.show', compact('sensor', 'parameterOptions', 'statusOptions'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MasSensor $sensor): View
    {
        $devices = MasDevice::where('status', 'active')->get();
        $models = MasModel::all();
        $parameterOptions = MasSensor::getParameterOptions();
        $statusOptions = MasSensor::getStatusOptions();

        return view('admin.mas_sensors.edit', compact('sensor', 'devices', 'models', 'parameterOptions', 'statusOptions'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MasSensor $sensor): RedirectResponse
    {
        $validated = $request->validate([
            'mas_device_code' => 'required|string|max:100|exists:mas_devices,code',
            'code' => 'required|string|max:100|unique:mas_sensors,code,' . $sensor->id,
            'parameter' => 'required|in:water_level,rainfall',
            'unit' => 'required|string|max:50',
            'description' => 'nullable|string|max:500',
            'mas_model_code' => 'nullable|string|max:100|exists:mas_models,code',
            'threshold_safe' => 'nullable|numeric|min:0',
            'threshold_warning' => 'nullable|numeric|min:0',
            'threshold_danger' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'forecasting_status' => 'nullable|in:stopped,running,paused',
            'is_active' => 'nullable|boolean',
            'last_seen' => 'nullable|date',
        ]);

        $sensor->update($validated);

        return redirect()->route('admin.sensors.index')
            ->with('success', 'Sensor berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasSensor $sensor): RedirectResponse
    {
        $sensor->delete();

        return redirect()->route('admin.sensors.index')
            ->with('success', 'Sensor berhasil dihapus.');
    }
}
