<?php

namespace Database\Seeders;

use App\Models\MasSensor;
use App\Models\MasDevice;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasSensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, ensure every device has a water_level sensor
        MasDevice::all()->each(function ($device) {
            // Check if device already has a water_level sensor
            $hasWaterLevel = $device->sensors()->where('parameter', 'water_level')->exists();

            if (!$hasWaterLevel) {
                // Generate a unique sensor code
                do {
                    $sensorCode = 'SN-WL-' . str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT);
                    $exists = MasSensor::where('code', $sensorCode)->exists();
                } while ($exists);

                // Create a water_level sensor for this device
                MasSensor::create([
                    'mas_device_code' => $device->code,
                    'code' => $sensorCode,
                    'parameter' => 'water_level',
                    'unit' => 'm',
                    'description' => 'Water level sensor at ' . $device->name,
                    'mas_model_id' => null,
                    'threshold_safe' => 2.0,
                    'threshold_warning' => 2.5,
                    'threshold_danger' => 3.0,
                    'status' => 'active',
                    'last_seen' => now(),
                ]);
            }
        });

        // Then create additional random sensors
        MasSensor::factory(20)->create();
    }
}
