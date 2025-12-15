<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ApiDataSource;

class Sih3MeteorologiJuandaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Seeder untuk mengkonfigurasi API SIH3 DPU Air Jatim Prov - Meteorologi Juanda
     * URL: https://sih3.dpuair.jatimprov.go.id/api/meteorologi-juanda
     * 
     * API ini menyediakan data curah hujan dari stasiun meteorologi Juanda
     * dengan 37 stasiun (STA001-STA037) di area DAS Welang
     */
    public function run(): void
    {
        ApiDataSource::updateOrCreate(
            ['code' => 'sih3-meteorologi-juanda'],
            [
                'name' => 'SIH3 DPU Air Jatim - Meteorologi Juanda',
                'code' => 'sih3-meteorologi-juanda',
                'api_url' => 'https://sih3.dpuair.jatimprov.go.id/api/meteorologi-juanda',
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
                    // Data ada di dalam key "Data Meteorologi Juanda"
                    'data_path' => 'Data Meteorologi Juanda',
                    'fields' => [
                        // Field mapping dari API response ke sistem
                        'external_id' => 'kode',           // STA001, STA002, dll (KODE UTAMA untuk mapping)
                        'name' => 'judul',                 // STA. Welang - 001
                        'value' => 'value',                // Rainfall value (0.3, 12.6, dll) dalam mm
                        'timestamp' => 'created_at',       // 2025-11-06 01:13:18
                        'status' => 'label',               // Hujan Ringan, Tidak Hujan, Hujan Sedang, dll
                        'latitude' => 'lat',               // -7.55597
                        'longitude' => 'long',             // 112.8549
                    ],
                    'timestamp_format' => 'Y-m-d H:i:s',
                    'additional_fields' => [
                        // Fields tambahan yang bisa digunakan untuk metadata
                        'api_id' => 'id',                  // 4050, 4051, dll
                        'location' => 'alamat',            // "-" (mostly empty)
                        'date' => 'tanggal',               // 2025-11-06
                        'hour' => 'jam',                   // 0-23
                        'input_type' => 'tipe_input',      // jam / hari
                        'color' => 'warna',                // #00A75C, #00B2FF, dll
                        'icon' => 'icon',                  // 77_FesFkn.png
                    ],
                ],
                'fetch_interval_minutes' => 15,
                'last_fetch_at' => null,
                'last_success_at' => null,
                'last_error' => null,
                'consecutive_failures' => 0,
                'is_active' => false, // Set false dulu untuk safety, aktifkan setelah mapping sensor
                'description' => 'API Meteorologi Juanda dari SIH3 DPU Air Provinsi Jawa Timur.
                                 Menyediakan data curah hujan dari 37 stasiun meteorologi di area DAS Welang (Pasuruan).
                                 Data diupdate setiap jam dengan parameter utama: rainfall (mm).

                                 Status Labels (Rainfall Intensity):
                                 - "Tidak Hujan" - No rain (0 mm)
                                 - "Hujan Ringan" - Light rain (0.1 - 20.0 mm)
                                 - "Hujan Sedang" - Moderate rain (20.1 - 50.0 mm)
                                 - "Hujan Lebat / Badai" - Heavy rain / Storm (> 50.0 mm)
                                 - "Unknown" - Status tidak diketahui
                                 
                                 Coverage Area: DAS Welang, Kabupaten Pasuruan
                                 Station Codes: STA001 - STA037 (37 stations)',
            ]
        );

        $this->command->info('✅ SIH3 Meteorologi Juanda API source created successfully!');
        $this->command->info('📍 API URL: https://sih3.dpuair.jatimprov.go.id/api/meteorologi-juanda');
        $this->command->info('📊 Stations: 37 rainfall stations (STA001-STA037)');
        $this->command->info('🌧️  Parameter: Rainfall (mm)');
        $this->command->info('📍 Coverage: DAS Welang, Pasuruan');
        $this->command->info('⚙️  Status: Inactive (will auto-create devices on first fetch)');
        $this->command->newLine();
        $this->command->warn('⚠️  Next Steps:');
        $this->command->line('1. Test connection: php artisan sensor:fetch-api-data --source=sih3-meteorologi-juanda --test');
        $this->command->line('2. Auto-create devices: php artisan sensor:auto-create-api-devices --source=sih3-meteorologi-juanda');
        $this->command->line('3. Activate source: Update is_active to true');
        $this->command->newLine();
        $this->command->info('💡 Note: This API provides more detailed rainfall data with 37 stations in Welang watershed');
    }
}

