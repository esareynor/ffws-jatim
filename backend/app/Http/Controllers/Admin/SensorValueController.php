<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SensorValue;
use App\Models\MasSensor;
use App\Models\MasSensorParameter;
use App\Models\MasSensorThresholdTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SensorValueController extends Controller
{
    /**
     * Display a listing of the sensor values.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $status = $request->input('status');
        $sensorCode = $request->input('sensor_code');

        $query = SensorValue::with(['sensor', 'sensorParameter', 'thresholdTemplate']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('sensor_name', 'like', "%{$search}%")
                  ->orWhere('mas_sensor_code', 'like', "%{$search}%")
                  ->orWhereHas('sensor', function($sq) use ($search) {
                      $sq->where('code', 'like', "%{$search}%");
                  });
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($sensorCode) {
            $query->where('mas_sensor_code', $sensorCode);
        }

        $sensorValues = $query->orderBy('created_at', 'desc')->paginate($perPage)->appends(request()->query());

        $sensors = MasSensor::where('status', 'active')->get(['id', 'code', 'parameter']);
        $parameters = MasSensorParameter::all(['id', 'code', 'name']);
        $thresholds = MasSensorThresholdTemplate::where('is_active', true)->get(['id', 'code', 'name']);

        // Prepare filter configuration
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Cari berdasarkan nama atau kode sensor...'
            ],
            [
                'type' => 'select',
                'name' => 'status',
                'label' => 'Status',
                'empty_option' => 'Semua Status',
                'options' => [
                    ['value' => 'active', 'label' => 'Active'],
                    ['value' => 'inactive', 'label' => 'Inactive'],
                    ['value' => 'fault', 'label' => 'Fault']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'sensor_code',
                'label' => 'Sensor',
                'empty_option' => 'Semua Sensor',
                'options' => $sensors->map(function($sensor) {
                    return [
                        'value' => $sensor->code,
                        'label' => $sensor->code . ' (' . $sensor->parameter . ')'
                    ];
                })->toArray()
            ]
        ];

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'formatted_sensor_name', 'label' => 'Sensor Name'],
            ['key' => 'mas_sensor_code', 'label' => 'Sensor Code'],
            ['key' => 'formatted_parameter', 'label' => 'Parameter'],
            ['key' => 'sensor_unit', 'label' => 'Unit'],
            ['key' => 'status', 'label' => 'Status', 'format' => 'status'],
            ['key' => 'formatted_last_seen', 'label' => 'Last Seen'],
            ['key' => 'actions', 'label' => 'Actions', 'format' => 'actions']
        ];

        // Format rows data
        $sensorValues->getCollection()->transform(function ($value) {
            // Format sensor name with icon
            $iconHtml = '';
            if ($value->sensor_icon_path) {
                $iconHtml = '<img src="' . asset('storage/' . $value->sensor_icon_path) . '" class="h-8 w-8 rounded mr-3" alt="Icon">';
            } else {
                $iconHtml = '<div class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3"><i class="fa-solid fa-sensor text-gray-400"></i></div>';
            }
            
            $statusBadge = $value->is_active 
                ? '<span class="text-xs text-green-600 dark:text-green-400">Active</span>' 
                : '<span class="text-xs text-gray-500 dark:text-gray-400">Inactive</span>';
            
            $value->formatted_sensor_name = '<div class="flex items-center">' . $iconHtml . '<div><div class="text-sm font-medium text-gray-900 dark:text-gray-100">' . ($value->sensor_name ?? 'N/A') . '</div>' . $statusBadge . '</div></div>';
            
            // Format parameter
            $value->formatted_parameter = $value->sensorParameter ? $value->sensorParameter->name : '<span class="text-gray-400">-</span>';
            
            // Format last seen
            $value->formatted_last_seen = $value->last_seen ? $value->last_seen->diffForHumans() : 'Never';
            
            // Format status for table component
            // Keep original status values (active, inactive, fault) as they are supported by table component
            $value->formatted_threshold_status = $value->status;
            
            // Format actions
            $value->actions = [
                [
                    'label' => 'View',
                    'icon' => 'eye',
                    'url' => '#',
                    'onclick' => 'viewDetail(' . $value->id . ')',
                    'color' => 'gray'
                ],
                [
                    'label' => 'Edit',
                    'icon' => 'pen',
                    'url' => '#',
                    'onclick' => 'editValue(' . $value->id . ')',
                    'color' => 'gray'
                ],
                [
                    'label' => 'Delete',
                    'icon' => 'trash',
                    'url' => route('admin.sensor-values.destroy', $value->id),
                    'method' => 'DELETE',
                    'confirm' => 'Data yang dihapus tidak dapat dikembalikan. Lanjutkan?',
                    'color' => 'red'
                ]
            ];
            
            return $value;
        });

        return view('admin.sensor_values.index', compact('sensorValues', 'sensors', 'parameters', 'thresholds', 'filterConfig', 'tableHeaders'));
    }

    /**
     * Show the form for creating a new sensor value.
     */
    public function create()
    {
        $sensors = MasSensor::where('status', 'active')->get(['id', 'code', 'parameter']);
        $parameters = MasSensorParameter::all(['id', 'code', 'name']);
        $thresholds = MasSensorThresholdTemplate::where('is_active', true)->get(['id', 'code', 'name']);

        return view('admin.sensor_values.create', compact('sensors', 'parameters', 'thresholds'));
    }

    /**
     * Store a newly created sensor value in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mas_sensor_code' => 'required|string|max:100|exists:mas_sensors,code',
            'mas_sensor_parameter_code' => 'required|string|max:100|exists:mas_sensor_parameters,code',
            'mas_sensor_threshold_code' => 'nullable|string|max:100|exists:mas_sensor_threshold_templates,code',
            'sensor_name' => 'nullable|string|max:255',
            'sensor_unit' => 'nullable|string|max:50',
            'sensor_description' => 'nullable|string',
            'sensor_icon' => 'nullable|image|mimes:jpeg,jpg,png,svg|max:2048',
            'status' => 'required|in:active,inactive,fault',
            'is_active' => 'boolean',
            'last_seen' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->except('sensor_icon');

            // Handle icon upload
            if ($request->hasFile('sensor_icon')) {
                $icon = $request->file('sensor_icon');
                $iconPath = $icon->store('sensor_icons', 'public');
                $data['sensor_icon_path'] = $iconPath;
            }

            $sensorValue = SensorValue::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Sensor value created successfully',
                'data' => $sensorValue->load(['sensor', 'sensorParameter', 'thresholdTemplate'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create sensor value: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified sensor value.
     */
    public function show($id)
    {
        try {
            $sensorValue = SensorValue::with(['sensor', 'sensorParameter', 'thresholdTemplate'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $sensorValue
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sensor value not found'
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified sensor value.
     */
    public function edit($id)
    {
        $sensorValue = SensorValue::findOrFail($id);
        $sensors = MasSensor::where('status', 'active')->get(['id', 'code', 'parameter']);
        $parameters = MasSensorParameter::all(['id', 'code', 'name']);
        $thresholds = MasSensorThresholdTemplate::where('is_active', true)->get(['id', 'code', 'name']);

        return view('admin.sensor_values.edit', compact('sensorValue', 'sensors', 'parameters', 'thresholds'));
    }

    /**
     * Update the specified sensor value in storage.
     */
    public function update(Request $request, $id)
    {
        $sensorValue = SensorValue::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'mas_sensor_code' => 'required|string|max:100|exists:mas_sensors,code',
            'mas_sensor_parameter_code' => 'required|string|max:100|exists:mas_sensor_parameters,code',
            'mas_sensor_threshold_code' => 'nullable|string|max:100|exists:mas_sensor_threshold_templates,code',
            'sensor_name' => 'nullable|string|max:255',
            'sensor_unit' => 'nullable|string|max:50',
            'sensor_description' => 'nullable|string',
            'sensor_icon' => 'nullable|image|mimes:jpeg,jpg,png,svg|max:2048',
            'status' => 'required|in:active,inactive,fault',
            'is_active' => 'boolean',
            'last_seen' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->except('sensor_icon');

            // Handle icon upload
            if ($request->hasFile('sensor_icon')) {
                // Delete old icon if exists
                if ($sensorValue->sensor_icon_path) {
                    Storage::disk('public')->delete($sensorValue->sensor_icon_path);
                }

                $icon = $request->file('sensor_icon');
                $iconPath = $icon->store('sensor_icons', 'public');
                $data['sensor_icon_path'] = $iconPath;
            }

            $sensorValue->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Sensor value updated successfully',
                'data' => $sensorValue->load(['sensor', 'sensorParameter', 'thresholdTemplate'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update sensor value: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified sensor value from storage.
     */
    public function destroy($id)
    {
        try {
            $sensorValue = SensorValue::findOrFail($id);

            // Delete icon file if exists
            if ($sensorValue->sensor_icon_path) {
                Storage::disk('public')->delete($sensorValue->sensor_icon_path);
            }

            $sensorValue->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sensor value deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete sensor value: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sensor values by sensor code.
     */
    public function getBySensor($sensorCode)
    {
        try {
            $sensorValues = SensorValue::with(['sensor', 'sensorParameter', 'thresholdTemplate'])
                ->where('mas_sensor_code', $sensorCode)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $sensorValues
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch sensor values: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active sensor values only.
     */
    public function getActive()
    {
        try {
            $sensorValues = SensorValue::with(['sensor', 'sensorParameter', 'thresholdTemplate'])
                ->active()
                ->get();

            return response()->json([
                'success' => true,
                'data' => $sensorValues
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch active sensor values: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update last seen timestamp.
     */
    public function updateLastSeen($id)
    {
        try {
            $sensorValue = SensorValue::findOrFail($id);
            $sensorValue->update(['last_seen' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Last seen updated successfully',
                'data' => $sensorValue
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update last seen: ' . $e->getMessage()
            ], 500);
        }
    }
}
