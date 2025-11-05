<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ApiDataSource;

class ApiDataSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Example 1: Public API (JSONPlaceholder for demo)
        ApiDataSource::create([
            'name' => 'Demo Public API',
            'code' => 'demo-public',
            'api_url' => 'https://jsonplaceholder.typicode.com/posts',
            'api_method' => 'GET',
            'api_headers' => [
                'Accept' => 'application/json',
            ],
            'auth_type' => 'none',
            'response_format' => 'json',
            'data_mapping' => [
                'fields' => [
                    'external_id' => 'id',
                    'value' => 'userId',
                    'timestamp' => null, // akan menggunakan waktu sekarang
                ],
            ],
            'fetch_interval_minutes' => 60,
            'is_active' => false, // inactive by default untuk demo
            'description' => 'Demo API source for testing purposes',
        ]);

        // Example 2: Weather API Template
        ApiDataSource::create([
            'name' => 'Weather Station Network',
            'code' => 'weather-network',
            'api_url' => 'https://api.example.com/weather/stations',
            'api_method' => 'GET',
            'api_headers' => [
                'Accept' => 'application/json',
            ],
            'api_params' => [
                'region' => 'east-java',
            ],
            'auth_type' => 'api_key',
            'auth_credentials' => [
                'header' => 'X-API-Key',
                'key' => 'your-api-key-here',
            ],
            'response_format' => 'json',
            'data_mapping' => [
                'data_path' => 'data.stations',
                'fields' => [
                    'device_code' => 'station_id',
                    'sensor_code' => 'sensor_code',
                    'external_id' => 'id',
                    'value' => 'reading.value',
                    'timestamp' => 'reading.timestamp',
                    'status' => 'status',
                ],
                'timestamp_format' => 'Y-m-d H:i:s',
            ],
            'fetch_interval_minutes' => 15,
            'is_active' => false,
            'description' => 'Template for weather station API integration',
        ]);

        // Example 3: IoT Platform Template
        ApiDataSource::create([
            'name' => 'IoT Sensor Platform',
            'code' => 'iot-platform',
            'api_url' => 'https://iot.example.com/api/v1/devices/readings',
            'api_method' => 'GET',
            'auth_type' => 'bearer',
            'auth_credentials' => [
                'token' => 'your-bearer-token-here',
            ],
            'response_format' => 'json',
            'data_mapping' => [
                'fields' => [
                    'external_id' => 'device_id',
                    'sensor_code' => 'sensor_type',
                    'value' => 'value',
                    'timestamp' => 'timestamp',
                ],
                'timestamp_format' => 'c', // ISO 8601
            ],
            'fetch_interval_minutes' => 10,
            'is_active' => false,
            'description' => 'Template for IoT platform integration',
        ]);
    }
}
