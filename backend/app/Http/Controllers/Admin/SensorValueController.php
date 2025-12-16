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

        $sensorValues = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $sensors = MasSensor::where('status', 'active')->get(['id', 'code', 'parameter']);
        $parameters = MasSensorParameter::all(['id', 'code', 'name']);
        $thresholds = MasSensorThresholdTemplate::where('is_active', true)->get(['id', 'code', 'name']);

        return view('admin.sensor_values.index', compact('sensorValues', 'sensors', 'parameters', 'thresholds'));
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
