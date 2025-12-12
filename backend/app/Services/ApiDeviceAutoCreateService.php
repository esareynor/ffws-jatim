<?php

namespace App\Services;

use App\Models\MasDevice;
use App\Models\MasSensor;
use App\Models\ApiDataSource;
use App\Models\SensorApiMapping;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ApiDeviceAutoCreateService
{
    /**
     * Auto-create device and sensor from API data
     *
     * @param array $record API record data
     * @param ApiDataSource $source API source configuration
     * @return array ['device' => MasDevice, 'sensor' => MasSensor, 'mapping' => SensorApiMapping]
     */
    public function autoCreateFromApiRecord(array $record, ApiDataSource $source): array
    {
        $mapping = $source->data_mapping;
        $fieldMap = $mapping['fields'] ?? [];

        // Extract identifiers from API record
        $externalId = $this->extractValue($record, $fieldMap['external_id'] ?? 'kode');
        $name = $this->extractValue($record, $fieldMap['name'] ?? 'judul');
        $latitude = $this->extractValue($record, $fieldMap['latitude'] ?? 'latitude');
        $longitude = $this->extractValue($record, $fieldMap['longitude'] ?? 'longitude');

        if (!$externalId || !$name) {
            throw new \Exception("Missing required fields: external_id or name");
        }

        // Determine parameter type from source code
        $parameter = $this->determineParameter($source->code);
        $unit = $this->determineUnit($parameter);

        // Generate codes
        $deviceCode = $this->generateDeviceCode($source->code, $externalId);
        $sensorCode = $this->generateSensorCode($deviceCode, $parameter);

        // Create or get device
        $device = $this->createOrUpdateDevice([
            'code' => $deviceCode,
            'name' => $this->cleanName($name),
            'latitude' => $latitude,
            'longitude' => $longitude,
            'source' => $source->code,
        ]);

        // Create or get sensor
        $sensor = $this->createOrUpdateSensor([
            'mas_device_code' => $device->code,
            'code' => $sensorCode,
            'parameter' => $parameter,
            'unit' => $unit,
            'name' => $name,
            'source' => $source->code,
        ]);

        // Create or get mapping
        $sensorMapping = $this->createOrUpdateMapping([
            'api_data_source_id' => $source->id,
            'mas_sensor_code' => $sensor->code,
            'mas_device_code' => $device->code,
            'external_sensor_id' => $externalId,
        ]);

        Log::info('Auto-created device and sensor from API', [
            'source' => $source->code,
            'device_code' => $device->code,
            'sensor_code' => $sensor->code,
            'external_id' => $externalId,
        ]);

        return [
            'device' => $device,
            'sensor' => $sensor,
            'mapping' => $sensorMapping,
        ];
    }

    /**
     * Create or update device
     */
    protected function createOrUpdateDevice(array $data): MasDevice
    {
        $device = MasDevice::firstOrNew(['code' => $data['code']]);

        $device->fill([
            'name' => $data['name'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'mas_river_basin_code' => 'API-SOURCE', // Default river basin untuk API sources
            'elevation_m' => 0,
            'status' => 'active',
        ]);

        // Only update lat/lng if they're not set or if new values are provided
        if (!$device->exists || ($data['latitude'] && $data['longitude'])) {
            $device->latitude = $data['latitude'];
            $device->longitude = $data['longitude'];
        }

        $device->save();

        return $device;
    }

    /**
     * Create or update sensor
     */
    protected function createOrUpdateSensor(array $data): MasSensor
    {
        $sensor = MasSensor::firstOrNew([
            'mas_device_code' => $data['mas_device_code'],
            'code' => $data['code'],
        ]);

        $sensor->fill([
            'parameter' => $data['parameter'],
            'unit' => $data['unit'],
            'description' => "Auto-created from API: {$data['name']}",
            'status' => 'active',
        ]);

        $sensor->save();

        return $sensor;
    }

    /**
     * Create or update sensor mapping
     */
    protected function createOrUpdateMapping(array $data): SensorApiMapping
    {
        $mapping = SensorApiMapping::firstOrNew([
            'api_data_source_id' => $data['api_data_source_id'],
            'external_sensor_id' => $data['external_sensor_id'],
        ]);

        $mapping->fill([
            'mas_sensor_code' => $data['mas_sensor_code'],
            'mas_device_code' => $data['mas_device_code'],
            'is_active' => true,
        ]);

        $mapping->save();

        return $mapping;
    }

    /**
     * Generate device code from source and external ID
     */
    protected function generateDeviceCode(string $sourceCode, string $externalId): string
    {
        // Extract prefix from source code
        // sih3-awlr-pusda -> AWLR
        // sih3-arr-pusda -> ARR
        // sih3-meteorologi-juanda -> METEO (rainfall)
        
        if (Str::contains($sourceCode, 'awlr')) {
            $prefix = 'AWLR';
        } elseif (Str::contains($sourceCode, 'arr')) {
            $prefix = 'ARR';
        } elseif (Str::contains($sourceCode, ['meteorologi', 'meteo'])) {
            $prefix = 'METEO';
        } else {
            $prefix = 'API';
        }

        return "{$prefix}-{$externalId}";
    }    /**
     * Generate sensor code from device code and parameter
     */
    protected function generateSensorCode(string $deviceCode, string $parameter): string
    {
        // AWLR-BE10126 -> AWLR-BE10126-WL
        // ARR-BE10124 -> ARR-BE10124-RF

        $suffix = match($parameter) {
            'water_level' => 'WL',
            'rainfall' => 'RF',
            'temperature' => 'TEMP',
            'humidity' => 'HUM',
            default => 'SENSOR',
        };

        return "{$deviceCode}-{$suffix}";
    }

    /**
     * Determine parameter from source code
     */
    protected function determineParameter(string $sourceCode): string
    {
        if (Str::contains($sourceCode, ['awlr', 'water', 'level'])) {
            return 'water_level';
        }
        
        if (Str::contains($sourceCode, ['arr', 'rain', 'hujan', 'meteorologi'])) {
            return 'rainfall';
        }
        
        if (Str::contains($sourceCode, ['temp', 'suhu'])) {
            return 'temperature';
        }
        
        if (Str::contains($sourceCode, ['hum', 'kelembaban'])) {
            return 'humidity';
        }

        return 'unknown';
    }    /**
     * Determine unit from parameter
     */
    protected function determineUnit(string $parameter): string
    {
        return match($parameter) {
            'water_level' => 'm',
            'rainfall' => 'mm',
            'temperature' => '°C',
            'humidity' => '%',
            'discharge' => 'm³/s',
            default => 'unit',
        };
    }

    /**
     * Clean name from API
     */
    protected function cleanName(string $name): string
    {
        // Remove extra spaces and trim
        $name = preg_replace('/\s+/', ' ', $name);
        $name = trim($name);

        return $name;
    }

    /**
     * Extract value from nested array
     */
    protected function extractValue(array $data, ?string $path)
    {
        if ($path === null) {
            return null;
        }

        $keys = explode('.', $path);
        $value = $data;

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
     * Batch auto-create from multiple records
     */
    public function batchAutoCreate(array $records, ApiDataSource $source): array
    {
        $results = [
            'success' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        foreach ($records as $record) {
            try {
                $this->autoCreateFromApiRecord($record, $source);
                $results['success']++;
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][] = [
                    'record' => $record,
                    'error' => $e->getMessage(),
                ];

                Log::warning('Failed to auto-create from API record', [
                    'record' => $record,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $results;
    }
}
