<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ApiDataSource;

class Sih3RainfallApiSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seeder untuk mengkonfigurasi API SIH3 DPU Air Jatim Prov - ARR (Rainfall)
     * URL: https://sih3.dpuair.jatimprov.go.id/api/cuaca-arr-pusda
     */
    public function run(): void
    {
        ApiDataSource::updateOrCreate(
            ['code' => 'sih3-arr-pusda'],
            [
                'name' => 'SIH3 DPU Air Jatim - ARR PUSDA (Rainfall)',
                'code' => 'sih3-arr-pusda',
                'api_url' => 'https://sih3.dpuair.jatimprov.go.id/api/cuaca-arr-pusda',
                'api_method' => 'GET',
                'api_headers' => [
                    'Accept' => 'application/json',
                    'User-Agent' => 'FFWS-Jatim-V2',
                ],
                'api_params' => null,
                'api_body' => null,
                'auth_type' => 'none',
                'response_format' => 'json',
                'data_mapping' => [
                    // Data ada di dalam key "Hujan Jam-Jam an PU SDA"
                    'data_path' => 'Hujan Jam-Jam an PU SDA',
                    'fields' => [
                        // Field mapping dari API response ke sistem
                        'external_id' => 'kode',           // BE10124, BE10125, dll (KODE UTAMA untuk mapping)
                        'name' => 'judul',                 // ARR Cendono
                        'value' => 'value',                // Rainfall value (0.00, 5.50, dll) dalam mm
                        'timestamp' => 'created_at',       // 2025-09-30 00:02:53
                        'status' => 'label',               // Tidak Hujan, Hujan Ringan, Hujan Sedang, dll
                        'latitude' => 'lat',               // -7.7579799
                        'longitude' => 'long',             // 112.6925315
                    ],
                    'timestamp_format' => 'Y-m-d H:i:s',
                    'additional_fields' => [
                        // Fields tambahan yang bisa digunakan untuk metadata
                        'api_id' => 'id',                  // 3060, 3061, dll
                        'location' => 'alamat',            // Pasuruan
                        'date' => 'tanggal',               // 2025-09-30
                        'hour' => 'jam',                   // 0-23
                        'input_type' => 'tipe_input',      // jam / hari
                        'color' => 'warna',                // #000000, dll
                        'icon' => 'icon',                  // 38_x1oKUs.png
                    ],
                ],
                'fetch_interval_minutes' => 15,
                'last_fetch_at' => null,
                'last_success_at' => null,
                'last_error' => null,
                'consecutive_failures' => 0,
                'is_active' => false, // Set false dulu untuk safety, aktifkan setelah mapping sensor
                'description' => 'API ARR (Automatic Rainfall Recorder) dari SIH3 DPU Air Provinsi Jawa Timur.
                                 Menyediakan data curah hujan dari berbagai pos hujan di Jawa Timur secara real-time.
                                 Data diupdate setiap jam dengan parameter utama: rainfall (mm).

                                 Status Labels:
                                 - "Tidak Hujan" (0 mm)
                                 - "Hujan Ringan" (0.1 - 5.0 mm)
                                 - "Hujan Sedang" (5.1 - 10.0 mm)
                                 - "Hujan Lebat" (10.1 - 20.0 mm)
                                 - "Hujan Sangat Lebat" (> 20.0 mm)',
            ]
        );

        $this->command->info('✅ SIH3 ARR PUSDA API source created successfully!');
        $this->command->info('📍 API URL: https://sih3.dpuair.jatimprov.go.id/api/cuaca-arr-pusda');
        $this->command->info('⚙️  Status: Inactive (configure sensor mappings first)');
        $this->command->newLine();
        $this->command->warn('⚠️  Next Steps:');
        $this->command->line('1. Test connection: php artisan sensor:fetch-api-data --source=sih3-arr-pusda --test');
        $this->command->line('2. Create sensor mappings for each rainfall station (kode)');
        $this->command->line('3. Activate source: Update is_active to true');
        $this->command->newLine();
        $this->command->info('💡 Note: This API provides rainfall data (ARR), different from AWLR (water level)');
    }
}
