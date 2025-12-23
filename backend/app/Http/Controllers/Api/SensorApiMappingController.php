<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SensorApiMapping;
use App\Models\ApiDataSource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SensorApiMappingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = SensorApiMapping::with(['dataSource', 'sensor', 'device']);

        // Filter by data source
        if ($request->filled('api_data_source_id')) {
            $query->where('api_data_source_id', $request->input('api_data_source_id'));
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by device
        if ($request->filled('mas_device_code')) {
            $query->where('mas_device_code', $request->input('mas_device_code'));
        }

        $perPage = $request->input('per_page', 15);
        $mappings = $query->paginate($perPage);

        return response()->json($mappings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'api_data_source_id' => 'required|exists:api_data_sources,id',
            'mas_sensor_code' => 'required|exists:mas_sensors,code',
            'mas_device_code' => 'required|exists:mas_devices,code',
            'external_sensor_id' => 'nullable|string',
            'field_mapping' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check for duplicate mapping
        $exists = SensorApiMapping::where('api_data_source_id', $request->api_data_source_id)
            ->where('mas_sensor_code', $request->mas_sensor_code)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Mapping already exists for this sensor and data source',
            ], 422);
        }

        $mapping = SensorApiMapping::create($request->all());

        return response()->json([
            'message' => 'Sensor API mapping created successfully',
            'data' => $mapping->load(['dataSource', 'sensor', 'device']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mapping = SensorApiMapping::with(['dataSource', 'sensor', 'device'])
            ->findOrFail($id);

        return response()->json($mapping);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $mapping = SensorApiMapping::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'api_data_source_id' => 'sometimes|exists:api_data_sources,id',
            'mas_sensor_code' => 'sometimes|exists:mas_sensors,code',
            'mas_device_code' => 'sometimes|exists:mas_devices,code',
            'external_sensor_id' => 'nullable|string',
            'field_mapping' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $mapping->update($request->all());

        return response()->json([
            'message' => 'Sensor API mapping updated successfully',
            'data' => $mapping->load(['dataSource', 'sensor', 'device']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mapping = SensorApiMapping::findOrFail($id);
        $mapping->delete();

        return response()->json([
            'message' => 'Sensor API mapping deleted successfully',
        ]);
    }

    /**
     * Bulk create mappings
     */
    public function bulkCreate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mappings' => 'required|array',
            'mappings.*.api_data_source_id' => 'required|exists:api_data_sources,id',
            'mappings.*.mas_sensor_code' => 'required|exists:mas_sensors,code',
            'mappings.*.mas_device_code' => 'required|exists:mas_devices,code',
            'mappings.*.external_sensor_id' => 'nullable|string',
            'mappings.*.field_mapping' => 'nullable|array',
            'mappings.*.is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $created = [];
        $skipped = [];

        foreach ($request->mappings as $mappingData) {
            // Check for duplicate
            $exists = SensorApiMapping::where('api_data_source_id', $mappingData['api_data_source_id'])
                ->where('mas_sensor_code', $mappingData['mas_sensor_code'])
                ->exists();

            if ($exists) {
                $skipped[] = $mappingData['mas_sensor_code'];
                continue;
            }

            $created[] = SensorApiMapping::create($mappingData);
        }

        return response()->json([
            'message' => 'Bulk create completed',
            'created' => count($created),
            'skipped' => count($skipped),
            'data' => $created,
        ], 201);
    }
}
