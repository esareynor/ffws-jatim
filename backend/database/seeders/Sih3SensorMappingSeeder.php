<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ApiDataSource;
use App\Models\SensorApiMapping;
use App\Models\MasDevice;
use App\Models\MasSensor;

class Sih3SensorMappingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seeder untuk membuat mapping sensor FFWS ke SIH3 AWLR PUSDA API
     *
     * CARA MENGGUNAKAN:
     * 1. Pastikan device dan sensor sudah dibuat di mas_devices dan mas_sensors
     * 2. Update array $mappings di bawah dengan data yang sesuai
     * 3. Run: php artisan db:seed --class=Sih3SensorMappingSeeder
     */
    public function run(): void
    {
        // Get API data source
        $apiSource = ApiDataSource::where('code', 'sih3-awlr-pusda')->first();

        if (!$apiSource) {
            $this->command->error('❌ SIH3 API source not found!');
            $this->command->warn('Run first: php artisan db:seed --class=Sih3ApiSourceSeeder');
            return;
        }

        $this->command->info('📡 Creating sensor mappings for SIH3 AWLR PUSDA API...');
        $this->command->newLine();

        /**
         * CONFIGURATION: Mapping SIH3 stations ke FFWS sensors
         *
         * Format:
         * [
         *   'sih3_kode' => 'BE10126',                    // Kode station di SIH3
         *   'sih3_external_id' => '1478',                // ID di SIH3 (optional, untuk tracking)
         *   'sih3_name' => 'Dhompo - S.Welang',         // Nama station di SIH3 (info only)
         *   'ffws_device_code' => 'AWS-001',             // Device code di FFWS (HARUS ADA di mas_devices)
         *   'ffws_sensor_code' => 'AWS-001-WL',          // Sensor code di FFWS (HARUS ADA di mas_sensors)
         * ]
         */
        $mappings = [
            // CONTOH MAPPING - SESUAIKAN DENGAN DATA ANDA
            // Uncomment dan edit sesuai dengan device/sensor yang ada di database

            /*
            [
                'sih3_kode' => 'BE10126',
                'sih3_external_id' => '1478',
                'sih3_name' => 'Dhompo - S.Welang',
                'ffws_device_code' => 'AWLR-DHOMPO',
                'ffws_sensor_code' => 'AWLR-DHOMPO-WL',
            ],
            [
                'sih3_kode' => 'BE10127',
                'sih3_external_id' => '3058',
                'sih3_name' => 'Selowongko - S.Welang',
                'ffws_device_code' => 'AWLR-SELOWONGKO',
                'ffws_sensor_code' => 'AWLR-SELOWONGKO-WL',
            ],
            [
                'sih3_kode' => 'BE10128',
                'sih3_external_id' => '3059',
                'sih3_name' => 'Purwodadi - S.Welang',
                'ffws_device_code' => 'AWLR-PURWODADI',
                'ffws_sensor_code' => 'AWLR-PURWODADI-WL',
            ],
            */
        ];

        if (empty($mappings)) {
            $this->command->warn('⚠️  No mappings configured!');
            $this->command->newLine();
            $this->command->info('📝 To create mappings:');
            $this->command->line('1. Edit file: database/seeders/Sih3SensorMappingSeeder.php');
            $this->command->line('2. Uncomment and configure the $mappings array');
            $this->command->line('3. Run: php artisan db:seed --class=Sih3SensorMappingSeeder');
            $this->command->newLine();
            $this->command->info('💡 Or create mappings via API:');
            $this->command->line('POST /api/sensor-api-mappings');
            return;
        }

        $created = 0;
        $skipped = 0;
        $errors = 0;

        foreach ($mappings as $mapping) {
            try {
                // Validate device exists
                $device = MasDevice::where('code', $mapping['ffws_device_code'])->first();
                if (!$device) {
                    $this->command->error("❌ Device not found: {$mapping['ffws_device_code']}");
                    $errors++;
                    continue;
                }

                // Validate sensor exists
                $sensor = MasSensor::where('code', $mapping['ffws_sensor_code'])->first();
                if (!$sensor) {
                    $this->command->error("❌ Sensor not found: {$mapping['ffws_sensor_code']}");
                    $errors++;
                    continue;
                }

                // Check if mapping already exists
                $exists = SensorApiMapping::where('api_data_source_id', $apiSource->id)
                    ->where('mas_sensor_code', $mapping['ffws_sensor_code'])
                    ->exists();

                if ($exists) {
                    $this->command->warn("⏭️  Skipped (already exists): {$mapping['ffws_sensor_code']}");
                    $skipped++;
                    continue;
                }

                // Create mapping
                SensorApiMapping::create([
                    'api_data_source_id' => $apiSource->id,
                    'mas_sensor_code' => $mapping['ffws_sensor_code'],
                    'mas_device_code' => $mapping['ffws_device_code'],
                    'external_sensor_id' => $mapping['sih3_kode'], // Store SIH3 kode as external_sensor_id
                    'field_mapping' => [
                        'sih3_external_id' => $mapping['sih3_external_id'],
                        'sih3_name' => $mapping['sih3_name'],
                        'sih3_kode' => $mapping['sih3_kode'],
                    ],
                    'is_active' => true,
                ]);

                $this->command->info("✅ Created: {$mapping['ffws_sensor_code']} ← SIH3:{$mapping['sih3_kode']} ({$mapping['sih3_name']})");
                $created++;

            } catch (\Exception $e) {
                $this->command->error("❌ Error creating mapping: {$e->getMessage()}");
                $errors++;
            }
        }

        $this->command->newLine();
        $this->command->info("📊 Summary:");
        $this->command->line("   ✅ Created: {$created}");
        $this->command->line("   ⏭️  Skipped: {$skipped}");
        $this->command->line("   ❌ Errors: {$errors}");
        $this->command->newLine();

        if ($created > 0) {
            $this->command->info('🎉 Sensor mappings created successfully!');
            $this->command->newLine();
            $this->command->info('📍 Next steps:');
            $this->command->line('1. Test fetch: php artisan sensor:fetch-api-data --source=sih3-awlr-pusda --test');
            $this->command->line('2. Manual fetch: php artisan sensor:fetch-api-data --source=sih3-awlr-pusda');
            $this->command->line('3. Activate source: Update api_data_sources.is_active = true');
        }
    }
}
