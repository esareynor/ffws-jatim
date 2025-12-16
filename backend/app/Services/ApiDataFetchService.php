<?php

namespace App\Services;

use App\Models\ApiDataSource;
use App\Models\ApiDataFetchLog;
use App\Models\MasSensor;
use App\Models\DataActual;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ApiDataFetchService
{
    protected $timeout = 30; // seconds
    protected $retryTimes = 3;
    protected $retryDelay = 1000; // milliseconds
    protected $autoCreateService;

    public function __construct(ApiDeviceAutoCreateService $autoCreateService)
    {
        $this->autoCreateService = $autoCreateService;
    }

    /**
     * Fetch data from a specific API data source
     */
    public function fetchFromSource(ApiDataSource $source): array
    {
        $startTime = microtime(true);
        $logData = [
            'api_data_source_id' => $source->id,
            'fetched_at' => now(),
            'status' => 'failed',
            'records_fetched' => 0,
            'records_saved' => 0,
            'records_failed' => 0,
        ];

        try {
            // Check if source is active
            if (!$source->is_active) {
                throw new \Exception('API data source is not active');
            }

            // Build HTTP request
            $http = $this->buildHttpClient($source);

            // Execute request
            $response = $this->executeRequest($http, $source);

            // Parse response
            $data = $this->parseResponse($response, $source);

            // Process and save data
            $result = $this->processData($data, $source);

            // Update log data
            $logData['status'] = 'success';
            $logData['records_fetched'] = $result['fetched'];
            $logData['records_saved'] = $result['saved'];
            $logData['records_failed'] = $result['failed'];
            $logData['response_summary'] = [
                'total_records' => count($data),
                'sample_record' => $data[0] ?? null,
            ];

            // Update source
            $source->update([
                'last_fetch_at' => now(),
                'last_success_at' => now(),
                'consecutive_failures' => 0,
                'last_error' => null,
            ]);

            return [
                'success' => true,
                'message' => 'Data fetched successfully',
                'data' => $result,
            ];

        } catch (\Exception $e) {
            Log::error('API Data Fetch Error', [
                'source' => $source->code,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            $logData['error_message'] = $e->getMessage();

            // Update source
            $source->update([
                'last_fetch_at' => now(),
                'last_error' => $e->getMessage(),
                'consecutive_failures' => $source->consecutive_failures + 1,
            ]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => null,
            ];
        } finally {
            $duration = (microtime(true) - $startTime) * 1000;
            $logData['duration_ms'] = round($duration);

            // Save fetch log
            ApiDataFetchLog::create($logData);
        }
    }

    /**
     * Fetch data from all active sources
     */
    public function fetchFromAllSources(): array
    {
        $sources = ApiDataSource::where('is_active', true)
            ->whereRaw('(last_fetch_at IS NULL OR last_fetch_at <= NOW() - INTERVAL fetch_interval_minutes MINUTE)')
            ->get();

        $results = [];

        foreach ($sources as $source) {
            $results[$source->code] = $this->fetchFromSource($source);
        }

        return $results;
    }

    /**
     * Build HTTP client with authentication and headers
     */
    protected function buildHttpClient(ApiDataSource $source)
    {
        $http = Http::timeout($this->timeout)
            ->retry($this->retryTimes, $this->retryDelay);

        // Add custom headers
        if (!empty($source->api_headers)) {
            foreach ($source->api_headers as $key => $value) {
                $http = $http->withHeader($key, $value);
            }
        }

        // Add authentication
        if ($source->auth_type) {
            $credentials = $source->getDecryptedCredentials();

            switch ($source->auth_type) {
                case 'bearer':
                    $http = $http->withToken($credentials['token'] ?? '');
                    break;

                case 'basic':
                    $http = $http->withBasicAuth(
                        $credentials['username'] ?? '',
                        $credentials['password'] ?? ''
                    );
                    break;

                case 'api_key':
                    $headerName = $credentials['header'] ?? 'X-API-Key';
                    $http = $http->withHeader($headerName, $credentials['key'] ?? '');
                    break;
            }
        }

        return $http;
    }

    /**
     * Execute HTTP request
     */
    protected function executeRequest($http, ApiDataSource $source)
    {
        $url = $source->api_url;
        $method = strtoupper($source->api_method);

        // Add query parameters for GET requests
        if ($method === 'GET' && !empty($source->api_params)) {
            $url .= '?' . http_build_query($source->api_params);
        }

        switch ($method) {
            case 'GET':
                $response = $http->get($url);
                break;

            case 'POST':
                $response = $http->post($url, $source->api_body ?? []);
                break;

            case 'PUT':
                $response = $http->put($url, $source->api_body ?? []);
                break;

            default:
                throw new \Exception("Unsupported HTTP method: {$method}");
        }

        if (!$response->successful()) {
            throw new \Exception("HTTP request failed with status {$response->status()}: {$response->body()}");
        }

        return $response;
    }

    /**
     * Parse API response based on format
     */
    protected function parseResponse($response, ApiDataSource $source): array
    {
        $format = $source->response_format ?? 'json';

        switch ($format) {
            case 'json':
                $data = $response->json();
                break;

            case 'xml':
                $xml = simplexml_load_string($response->body());
                $data = json_decode(json_encode($xml), true);
                break;

            default:
                throw new \Exception("Unsupported response format: {$format}");
        }

        // Extract data using mapping path
        $mapping = $source->data_mapping;
        if (isset($mapping['data_path'])) {
            $data = $this->extractDataByPath($data, $mapping['data_path']);
        }

        // Ensure data is array
        if (!is_array($data)) {
            throw new \Exception("Parsed data is not an array");
        }

        // If data is not a list, wrap it
        if (!isset($data[0])) {
            $data = [$data];
        }

        return $data;
    }

    /**
     * Extract data from nested array using dot notation path
     */
    protected function extractDataByPath($data, $path)
    {
        $keys = explode('.', $path);

        foreach ($keys as $key) {
            if (is_array($data) && isset($data[$key])) {
                $data = $data[$key];
            } else {
                return [];
            }
        }

        return $data;
    }

    /**
     * Process and save fetched data
     */
    protected function processData(array $data, ApiDataSource $source): array
    {
        $mapping = $source->data_mapping;
        $fetched = count($data);
        $saved = 0;
        $failed = 0;

        DB::beginTransaction();

        try {
            foreach ($data as $record) {
                try {
                    $this->saveSensorData($record, $mapping, $source);
                    $saved++;
                } catch (\Exception $e) {
                    $failed++;
                    Log::warning('Failed to save sensor data', [
                        'source' => $source->code,
                        'record' => $record,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return [
            'fetched' => $fetched,
            'saved' => $saved,
            'failed' => $failed,
        ];
    }

    /**
     * Save individual sensor data record
     */
    protected function saveSensorData(array $record, array $mapping, ApiDataSource $source): void
    {
        // Get field mappings
        $fieldMap = $mapping['fields'] ?? [];

        // Extract sensor identifier
        $sensorCode = $this->extractFieldValue($record, $fieldMap['sensor_code'] ?? null);
        $deviceCode = $this->extractFieldValue($record, $fieldMap['device_code'] ?? null);
        $externalId = $this->extractFieldValue($record, $fieldMap['external_id'] ?? null);

        // Try to find existing sensor mapping
        $sensorMapping = $source->sensorMappings()
            ->where('is_active', true)
            ->when($sensorCode, fn($q) => $q->where('mas_sensor_code', $sensorCode))
            ->when($externalId, fn($q) => $q->where('external_sensor_id', $externalId))
            ->first();

        // If no mapping found, try auto-create
        if (!$sensorMapping) {
            Log::info('No sensor mapping found, attempting auto-create', [
                'source' => $source->code,
                'external_id' => $externalId,
            ]);

            try {
                $created = $this->autoCreateService->autoCreateFromApiRecord($record, $source);
                $sensorMapping = $created['mapping'];

                Log::info('Successfully auto-created device and sensor', [
                    'device_code' => $created['device']->code,
                    'sensor_code' => $created['sensor']->code,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to auto-create device/sensor', [
                    'source' => $source->code,
                    'external_id' => $externalId,
                    'error' => $e->getMessage(),
                ]);
                throw new \Exception("No sensor mapping found and auto-create failed: {$e->getMessage()}");
            }
        }

        // Get sensor
        $sensor = $sensorMapping->sensor;

        if (!$sensor) {
            throw new \Exception("Sensor not found: {$sensorMapping->mas_sensor_code}");
        }

        // Extract data values
        $value = $this->extractFieldValue($record, $fieldMap['value'] ?? null);
        $timestamp = $this->extractFieldValue($record, $fieldMap['timestamp'] ?? null);
        $status = $this->extractFieldValue($record, $fieldMap['status'] ?? 'normal');

        // Parse timestamp
        if ($timestamp) {
            $timestampFormat = $mapping['timestamp_format'] ?? 'Y-m-d H:i:s';
            try {
                $timestamp = Carbon::createFromFormat($timestampFormat, $timestamp);
            } catch (\Exception $e) {
                $timestamp = Carbon::parse($timestamp);
            }
        } else {
            $timestamp = now();
        }

        // Calculate threshold status
        $thresholdStatus = $this->calculateThresholdStatus($value, $sensor);

        // Save to DataActual
        DataActual::updateOrCreate(
            [
                'mas_sensor_code' => $sensor->code,
                'received_at' => $timestamp,
            ],
            [
                'mas_sensor_id' => $sensor->id,
                'mas_device_code' => $sensor->mas_device_code,
                'value' => $value,
                'status' => $status,
                'threshold_status' => $thresholdStatus,
                'source' => 'api_fetch',
                'fetched_at' => now(),
            ]
        );

        // Update sensor last_seen
        $sensor->update(['last_seen' => now()]);
    }

    /**
     * Calculate threshold status based on sensor thresholds
     */
    protected function calculateThresholdStatus($value, MasSensor $sensor): ?string
    {
        if ($value === null) {
            return null;
        }

        // If no thresholds defined, return safe
        if (!$sensor->threshold_danger && !$sensor->threshold_warning) {
            return 'safe';
        }

        // Check danger threshold
        if ($sensor->threshold_danger && $value >= $sensor->threshold_danger) {
            return 'danger';
        }

        // Check warning threshold
        if ($sensor->threshold_warning && $value >= $sensor->threshold_warning) {
            return 'warning';
        }

        return 'safe';
    }

    /**
     * Extract field value from record using mapping path
     */
    protected function extractFieldValue(array $record, ?string $path)
    {
        if ($path === null) {
            return null;
        }

        // Support dot notation
        $keys = explode('.', $path);
        $value = $record;

        foreach ($keys as $key) {
            if (is_array($value) && isset($value[$key])) {
                $value = $value[$key];
            } else {
                return null;
            }
        }

        return $value;
    }

    /**
     * Test API connection without saving data
     */
    public function testConnection(ApiDataSource $source): array
    {
        try {
            $http = $this->buildHttpClient($source);
            $response = $this->executeRequest($http, $source);
            $data = $this->parseResponse($response, $source);

            return [
                'success' => true,
                'message' => 'Connection successful',
                'sample_data' => array_slice($data, 0, 3),
                'total_records' => count($data),
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
}
