<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class Sih3ApiIntegrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Master seeder untuk setup lengkap integrasi SIH3 DPU Air Jatim
     * Includes:
     * - AWLR (Water Level) API
     * - ARR (Rainfall) API
     * - Meteorologi Juanda (Rainfall Dense Grid) API
     */
    public function run(): void
    {
        $this->command->info('🌊 Setting up SIH3 DPU Air Jatim Integration...');
        $this->command->newLine();

        // Seed AWLR API Source
        $this->command->info('📊 [1/3] Setting up AWLR (Water Level) API...');
        $this->call(Sih3ApiSourceSeeder::class);
        $this->command->newLine();

        // Seed ARR API Source
        $this->command->info('🌧️  [2/3] Setting up ARR (Rainfall) API...');
        $this->call(Sih3RainfallApiSourceSeeder::class);
        $this->command->newLine();

        // Seed Meteorologi Juanda API Source
        $this->command->info('🌦️  [3/3] Setting up Meteorologi Juanda (Rainfall Dense Grid) API...');
        $this->call(Sih3MeteorologiJuandaSeeder::class);
        $this->command->newLine();

        // Summary
        $this->command->info('═══════════════════════════════════════════════════════════');
        $this->command->info('🎉 SIH3 Integration Setup Complete!');
        $this->command->info('═══════════════════════════════════════════════════════════');
        $this->command->newLine();

        $this->command->table(
            ['API Source', 'Parameter', 'Stations', 'Status'],
            [
                ['SIH3 AWLR PUSDA', 'Water Level (m)', '21', '⏸️  Inactive'],
                ['SIH3 ARR PUSDA', 'Rainfall (mm)', '20', '⏸️  Inactive'],
                ['Meteorologi Juanda', 'Rainfall (mm)', '37', '⏸️  Inactive'],
            ]
        );

        $this->command->newLine();
        $this->command->info('📋 Next Steps:');
        $this->command->line('1. Test all APIs:');
        $this->command->line('   php artisan sensor:fetch-api-data --source=sih3-awlr-pusda --test');
        $this->command->line('   php artisan sensor:fetch-api-data --source=sih3-arr-pusda --test');
        $this->command->line('   php artisan sensor:fetch-api-data --source=sih3-meteorologi-juanda --test');
        $this->command->newLine();
        $this->command->line('2. Auto-create devices and sensors:');
        $this->command->line('   php artisan sensor:auto-create-api-devices');
        $this->command->newLine();
        $this->command->line('3. Activate sources in database (set is_active = true)');
        $this->command->line('4. Start auto-fetch: php artisan sensor:fetch-api-data');
        $this->command->newLine();
        $this->command->info('📚 Documentation:');
        $this->command->line('   - SIH3_INTEGRATION_GUIDE.md');
        $this->command->line('   - SIH3_QUICK_SETUP.md');
    }
}
