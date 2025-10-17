<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MasRiverBasin;
use App\Models\MasModel;
use App\Models\MasDevice;
use App\Models\MasSensor;
use App\Models\DataActual;
use Carbon\Carbon;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create River Basins
        $riverBasins = [
            ['name' => 'DAS Brantas', 'code' => 'BRT001'],
            ['name' => 'DAS Bengawan Solo', 'code' => 'BSL001'],
            ['name' => 'DAS Sampean', 'code' => 'SMP001'],
        ];

        foreach ($riverBasins as $basin) {
            MasRiverBasin::firstOrCreate(['code' => $basin['code']], $basin);
        }

        // 2. Create Models
        $models = [
            [
                'name' => 'LSTM Water Level Predictor',
                'model_type' => 'LSTM',
                'version' => '1.0',
                'description' => 'LSTM model for water level prediction',
                'file_path' => 'models/water_level_lstm.h5',
                'n_steps_in' => 24,
                'n_steps_out' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'GRU Rainfall Predictor',
                'model_type' => 'GRU',
                'version' => '1.0',
                'description' => 'GRU model for rainfall prediction',
                'file_path' => 'models/rainfall_gru.h5',
                'n_steps_in' => 48,
                'n_steps_out' => 12,
                'is_active' => true,
            ],
        ];

        foreach ($models as $model) {
            MasModel::firstOrCreate(['name' => $model['name']], $model);
        }

        // 3. Create Devices
        $devices = [
            [
                'name' => 'Stasiun Monitoring Dhompo',
                'code' => 'DHM001',
                'mas_river_basin_id' => 1,
                'latitude' => -7.1234,
                'longitude' => 112.5678,
                'elevation_m' => 150.5,
                'status' => 'active',
            ],
            [
                'name' => 'Stasiun Monitoring Purwodadi',
                'code' => 'PWD001',
                'mas_river_basin_id' => 1,
                'latitude' => -7.8765,
                'longitude' => 112.1234,
                'elevation_m' => 200.0,
                'status' => 'active',
            ],
            [
                'name' => 'Stasiun Monitoring Surabaya',
                'code' => 'SBY001',
                'mas_river_basin_id' => 1,
                'latitude' => -7.2575,
                'longitude' => 112.7508,
                'elevation_m' => 10.0,
                'status' => 'active',
            ],
            [
                'name' => 'Stasiun Monitoring Malang',
                'code' => 'MLG001',
                'mas_river_basin_id' => 1,
                'latitude' => -7.9831,
                'longitude' => 112.6308,
                'elevation_m' => 450.0,
                'status' => 'active',
            ],
            [
                'name' => 'Stasiun Monitoring Sidoarjo',
                'code' => 'SDA001',
                'mas_river_basin_id' => 1,
                'latitude' => -7.4478,
                'longitude' => 112.7183,
                'elevation_m' => 15.0,
                'status' => 'active',
            ],
        ];

        foreach ($devices as $device) {
            MasDevice::firstOrCreate(['code' => $device['code']], $device);
        }

        // 4. Create Sensors
        $sensors = [
            // Dhompo Station Sensors
            [
                'device_id' => 1,
                'sensor_code' => 'DHM001_WL',
                'parameter' => 'water_level',
                'unit' => 'meter',
                'description' => 'Water level sensor at Dhompo station',
                'mas_model_id' => 1,
                'threshold_safe' => 2.0,
                'threshold_warning' => 2.5,
                'threshold_danger' => 3.0,
                'status' => 'active',
                'last_seen' => now(),
            ],
            [
                'device_id' => 1,
                'sensor_code' => 'DHM001_RF',
                'parameter' => 'rainfall',
                'unit' => 'mm/hour',
                'description' => 'Rainfall sensor at Dhompo station',
                'mas_model_id' => 2,
                'threshold_safe' => 10.0,
                'threshold_warning' => 25.0,
                'threshold_danger' => 50.0,
                'status' => 'active',
                'last_seen' => now(),
            ],
            // Purwodadi Station Sensors
            [
                'device_id' => 2,
                'sensor_code' => 'PWD001_WL',
                'parameter' => 'water_level',
                'unit' => 'meter',
                'description' => 'Water level sensor at Purwodadi station',
                'mas_model_id' => 1,
                'threshold_safe' => 1.5,
                'threshold_warning' => 2.0,
                'threshold_danger' => 2.5,
                'status' => 'active',
                'last_seen' => now(),
            ],
            // Surabaya Station Sensors
            [
                'device_id' => 3,
                'sensor_code' => 'SBY001_WL',
                'parameter' => 'water_level',
                'unit' => 'meter',
                'description' => 'Water level sensor at Surabaya station',
                'mas_model_id' => 1,
                'threshold_safe' => 1.0,
                'threshold_warning' => 1.5,
                'threshold_danger' => 2.0,
                'status' => 'active',
                'last_seen' => now(),
            ],
            // Malang Station Sensors
            [
                'device_id' => 4,
                'sensor_code' => 'MLG001_WL',
                'parameter' => 'water_level',
                'unit' => 'meter',
                'description' => 'Water level sensor at Malang station',
                'mas_model_id' => 1,
                'threshold_safe' => 3.0,
                'threshold_warning' => 4.0,
                'threshold_danger' => 5.0,
                'status' => 'active',
                'last_seen' => now(),
            ],
            // Sidoarjo Station Sensors
            [
                'device_id' => 5,
                'sensor_code' => 'SDA001_WL',
                'parameter' => 'water_level',
                'unit' => 'meter',
                'description' => 'Water level sensor at Sidoarjo station',
                'mas_model_id' => 1,
                'threshold_safe' => 1.2,
                'threshold_warning' => 1.8,
                'threshold_danger' => 2.2,
                'status' => 'active',
                'last_seen' => now(),
            ],
        ];

        foreach ($sensors as $sensor) {
            MasSensor::firstOrCreate(['sensor_code' => $sensor['sensor_code']], $sensor);
        }

        // 5. Create Sample Data Actuals (recent data for each sensor)
        $now = Carbon::now();
        $dataActuals = [];

        // Generate data for each sensor with different scenarios
        $sensorScenarios = [
            1 => ['base' => 2.7, 'variance' => 0.2, 'trend' => 'increasing'], // Dhompo WL - Warning level
            2 => ['base' => 15.0, 'variance' => 5.0, 'trend' => 'stable'], // Dhompo RF - Safe
            3 => ['base' => 2.3, 'variance' => 0.1, 'trend' => 'decreasing'], // Purwodadi WL - Danger
            4 => ['base' => 1.8, 'variance' => 0.3, 'trend' => 'stable'], // Surabaya WL - Warning
            5 => ['base' => 2.5, 'variance' => 0.4, 'trend' => 'stable'], // Malang WL - Safe
            6 => ['base' => 1.0, 'variance' => 0.2, 'trend' => 'stable'], // Sidoarjo WL - Safe
        ];

        foreach ($sensorScenarios as $sensorId => $scenario) {
            $sensor = MasSensor::find($sensorId);
            if (!$sensor) continue;

            // Generate 24 hours of data (hourly)
            for ($i = 23; $i >= 0; $i--) {
                $timestamp = $now->copy()->subHours($i);
                
                // Apply trend
                $trendFactor = 0;
                if ($scenario['trend'] === 'increasing') {
                    $trendFactor = (23 - $i) * 0.02; // Gradually increase
                } elseif ($scenario['trend'] === 'decreasing') {
                    $trendFactor = $i * -0.01; // Gradually decrease
                }
                
                // Calculate value with some randomness
                $baseValue = $scenario['base'] + $trendFactor;
                $randomVariance = (rand(-100, 100) / 100) * $scenario['variance'];
                $value = max(0, $baseValue + $randomVariance);
                
                $dataActuals[] = [
                    'mas_sensor_id' => $sensorId,
                    'mas_sensor_code' => $sensor->sensor_code,
                    'value' => round($value, 2),
                    'received_at' => $timestamp,
                    'threshold_status' => null, // Will be calculated by API
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ];
            }
        }

        // Insert data in chunks to avoid memory issues
        collect($dataActuals)->chunk(100)->each(function ($chunk) {
            DataActual::insert($chunk->toArray());
        });

        $this->command->info('Sample data seeded successfully!');
        $this->command->info('Created:');
        $this->command->info('- ' . MasRiverBasin::count() . ' river basins');
        $this->command->info('- ' . MasModel::count() . ' models');
        $this->command->info('- ' . MasDevice::count() . ' devices');
        $this->command->info('- ' . MasSensor::count() . ' sensors');
        $this->command->info('- ' . DataActual::count() . ' data actual records');
    }
}
