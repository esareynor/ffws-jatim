<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiDataSource;
use App\Services\ApiDataFetchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiDataSourceController extends Controller
{
    protected $fetchService;

    public function __construct(ApiDataFetchService $fetchService)
    {
        $this->fetchService = $fetchService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ApiDataSource::query();

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search by name or code
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Include relationships
        $query->with(['sensorMappings', 'fetchLogs' => function ($q) {
            $q->latest()->limit(5);
        }]);

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->input('per_page', 15);
        $sources = $query->paginate($perPage);

        return response()->json($sources);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:api_data_sources',
            'code' => 'required|string|max:255|unique:api_data_sources',
            'api_url' => 'required|url',
            'api_method' => 'required|in:GET,POST,PUT',
            'api_headers' => 'nullable|array',
            'api_params' => 'nullable|array',
            'api_body' => 'nullable|array',
            'auth_type' => 'nullable|in:bearer,basic,api_key,none',
            'auth_credentials' => 'nullable|array',
            'response_format' => 'required|in:json,xml',
            'data_mapping' => 'required|array',
            'data_mapping.fields' => 'required|array',
            'fetch_interval_minutes' => 'required|integer|min:1',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $source = ApiDataSource::create($request->all());

        return response()->json([
            'message' => 'API data source created successfully',
            'data' => $source,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code)
    {
        $source = ApiDataSource::where('code', $code)
            ->with(['sensorMappings.sensor', 'sensorMappings.device', 'fetchLogs' => function ($q) {
                $q->latest()->limit(10);
            }])
            ->firstOrFail();

        return response()->json($source);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code)
    {
        $source = ApiDataSource::where('code', $code)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:api_data_sources,name,' . $source->id,
            'code' => 'sometimes|string|max:255|unique:api_data_sources,code,' . $source->id,
            'api_url' => 'sometimes|url',
            'api_method' => 'sometimes|in:GET,POST,PUT',
            'api_headers' => 'nullable|array',
            'api_params' => 'nullable|array',
            'api_body' => 'nullable|array',
            'auth_type' => 'nullable|in:bearer,basic,api_key,none',
            'auth_credentials' => 'nullable|array',
            'response_format' => 'sometimes|in:json,xml',
            'data_mapping' => 'sometimes|array',
            'fetch_interval_minutes' => 'sometimes|integer|min:1',
            'is_active' => 'boolean',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $source->update($request->all());

        return response()->json([
            'message' => 'API data source updated successfully',
            'data' => $source,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code)
    {
        $source = ApiDataSource::where('code', $code)->firstOrFail();
        $source->delete();

        return response()->json([
            'message' => 'API data source deleted successfully',
        ]);
    }

    /**
     * Test connection to API source
     */
    public function testConnection(string $code)
    {
        $source = ApiDataSource::where('code', $code)->firstOrFail();

        $result = $this->fetchService->testConnection($source);

        return response()->json($result);
    }

    /**
     * Manually trigger fetch for a source
     */
    public function triggerFetch(string $code)
    {
        $source = ApiDataSource::where('code', $code)->firstOrFail();

        $result = $this->fetchService->fetchFromSource($source);

        return response()->json($result);
    }

    /**
     * Get fetch logs for a source
     */
    public function fetchLogs(Request $request, string $code)
    {
        $source = ApiDataSource::where('code', $code)->firstOrFail();

        $logs = $source->fetchLogs()
            ->orderBy('fetched_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($logs);
    }

    /**
     * Get statistics for a source
     */
    public function statistics(string $code)
    {
        $source = ApiDataSource::where('code', $code)->firstOrFail();

        $stats = [
            'total_fetches' => $source->fetchLogs()->count(),
            'successful_fetches' => $source->fetchLogs()->where('status', 'success')->count(),
            'failed_fetches' => $source->fetchLogs()->where('status', 'failed')->count(),
            'total_records_fetched' => $source->fetchLogs()->sum('records_fetched'),
            'total_records_saved' => $source->fetchLogs()->sum('records_saved'),
            'last_fetch_at' => $source->last_fetch_at,
            'last_success_at' => $source->last_success_at,
            'consecutive_failures' => $source->consecutive_failures,
            'active_sensor_mappings' => $source->sensorMappings()->where('is_active', true)->count(),
        ];

        return response()->json($stats);
    }
}
