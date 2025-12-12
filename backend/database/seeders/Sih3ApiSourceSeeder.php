<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ApiDataSource;

class Sih3ApiSourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seeder untuk mengkonfigurasi API SIH3 DPU Air Jatim Prov
     * URL: https://sih3.dpuair.jatimprov.go.id/api/cuaca-awlr-pusda
     */
    public function run(): void
    {
        ApiDataSource::updateOrCreate(
            ['code' => 'sih3-awlr-pusda'],
            [
                'name' => 'SIH3 DPU Air Jatim - AWLR PUSDA',
                'code' => 'sih3-awlr-pusda',
                'api_url' => 'https://sih3.dpuair.jatimprov.go.id/api/cuaca-awlr-pusda',
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
                    // Data ada di dalam key "Pos Duga Air Jam-jam an PU SDA"
                    'data_path' => 'Pos Duga Air Jam-jam an PU SDA',
                    'fields' => [
                        // Field mapping dari API response ke sistem
                        'external_id' => 'kode',           // BE10126, BE10127, dll (KODE UTAMA untuk mapping)
                        'name' => 'judul',                 // Dhompo - S.Welang
                        'value' => 'value',                // Water level value (0.683, 0.090, dll)
                        'timestamp' => 'created_at',       // 2025-11-05 23:15:24
                        'status' => 'label',               // Unknown, Normal, Waspada
                        'latitude' => 'lat',               // -7.6579889
                        'longitude' => 'long',             // 112.861328
                    ],
                    'timestamp_format' => 'Y-m-d H:i:s',
                    'additional_fields' => [
                        // Fields tambahan yang bisa digunakan untuk metadata
                        'api_id' => 'id',                  // 1478, 3058, dll
                        'location' => 'alamat',            // Pasuruan
                        'date' => 'tanggal',               // 2025-11-05
                        'hour' => 'jam',                   // 23
                        'input_type' => 'tipe_input',      // jam / hari
                        'color' => 'warna',                // gray, #00FF00, #FF9D00
                        'icon' => 'icon',                  // 45_Pea9QZ.png
                    ],
                ],
                'fetch_interval_minutes' => 15,
                'last_fetch_at' => null,
                'last_success_at' => null,
                'last_error' => null,
                'consecutive_failures' => 0,
                'is_active' => false, // Set false dulu untuk safety, aktifkan setelah mapping sensor
                'description' => 'API AWLR (Automatic Water Level Recorder) dari SIH3 DPU Air Provinsi Jawa Timur.
                                 Menyediakan data water level dari berbagai pos duga air di Jawa Timur secara real-time.
                                 Data diupdate setiap jam dengan parameter utama: water level (m).',
            ]
        );

        $this->command->info('✅ SIH3 AWLR PUSDA API source created successfully!');
        $this->command->info('📍 API URL: https://sih3.dpuair.jatimprov.go.id/api/cuaca-awlr-pusda');
        $this->command->info('⚙️  Status: Inactive (configure sensor mappings first)');
        $this->command->newLine();
        $this->command->warn('⚠️  Next Steps:');
        $this->command->line('1. Test connection: php artisan sensor:fetch-api-data --source=sih3-awlr-pusda --test');
        $this->command->line('2. Create sensor mappings for each station (kode)');
        $this->command->line('3. Activate source: Update is_active to true');
    }
}
