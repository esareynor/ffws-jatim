<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MasSensorThresholdTemplate;
use App\Models\MasSensorThresholdLevel;

class ThresholdSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding threshold system...');

        // Create Water Level Templates
        $this->createWaterLevelStandard();
        $this->createWaterLevelSimple();
        
        // Create Rainfall Template
        $this->createRainfallStandard();

        $this->command->info('Threshold system seeded successfully!');
    }

    /**
     * Create standard 5-level water level threshold template.
     */
    private function createWaterLevelStandard(): void
    {
        $template = MasSensorThresholdTemplate::create([
            'code' => 'THR_WL_STANDARD',
            'name' => 'Standard Water Level Thresholds',
            'description' => 'Standard 5-level water level threshold system',
            'parameter_type' => 'water_level',
            'unit' => 'meter',
            'is_active' => true,
        ]);

        $levels = [
            [
                'level_order' => 1,
                'level_name' => 'Normal',
                'level_code' => 'THR_WL_STD_NORMAL',
                'min_value' => 0.00,
                'max_value' => 1.50,
                'color' => 'green',
                'color_hex' => '#28a745',
                'severity' => 'normal',
                'alert_enabled' => false,
                'alert_message' => 'Water level is normal',
            ],
            [
                'level_order' => 2,
                'level_name' => 'Watch',
                'level_code' => 'THR_WL_STD_WATCH',
                'min_value' => 1.50,
                'max_value' => 2.00,
                'color' => 'blue',
                'color_hex' => '#17a2b8',
                'severity' => 'watch',
                'alert_enabled' => false,
                'alert_message' => 'Water level is rising - monitoring required',
            ],
            [
                'level_order' => 3,
                'level_name' => 'Warning',
                'level_code' => 'THR_WL_STD_WARNING',
                'min_value' => 2.00,
                'max_value' => 2.50,
                'color' => 'yellow',
                'color_hex' => '#ffc107',
                'severity' => 'warning',
                'alert_enabled' => true,
                'alert_message' => 'Warning: Water level approaching danger threshold',
            ],
            [
                'level_order' => 4,
                'level_name' => 'Danger',
                'level_code' => 'THR_WL_STD_DANGER',
                'min_value' => 2.50,
                'max_value' => 3.00,
                'color' => 'orange',
                'color_hex' => '#fd7e14',
                'severity' => 'danger',
                'alert_enabled' => true,
                'alert_message' => 'Danger: High water level detected',
            ],
            [
                'level_order' => 5,
                'level_name' => 'Critical',
                'level_code' => 'THR_WL_STD_CRITICAL',
                'min_value' => 3.00,
                'max_value' => null,
                'color' => 'red',
                'color_hex' => '#dc3545',
                'severity' => 'critical',
                'alert_enabled' => true,
                'alert_message' => 'CRITICAL: Extreme water level - immediate action required',
            ],
        ];

        foreach ($levels as $level) {
            MasSensorThresholdLevel::create(array_merge($level, [
                'threshold_template_code' => $template->code,
            ]));
        }

        $this->command->info('  ✓ Created: Standard Water Level (5 levels)');
    }

    /**
     * Create simple 3-level water level threshold template.
     */
    private function createWaterLevelSimple(): void
    {
        $template = MasSensorThresholdTemplate::create([
            'code' => 'THR_WL_SIMPLE',
            'name' => 'Simple Water Level Thresholds',
            'description' => 'Simple 3-level water level threshold system',
            'parameter_type' => 'water_level',
            'unit' => 'meter',
            'is_active' => true,
        ]);

        $levels = [
            [
                'level_order' => 1,
                'level_name' => 'Safe',
                'level_code' => 'THR_WL_SMP_SAFE',
                'min_value' => 0.00,
                'max_value' => 2.00,
                'color' => 'green',
                'color_hex' => '#28a745',
                'severity' => 'normal',
                'alert_enabled' => false,
                'alert_message' => 'Water level is safe',
            ],
            [
                'level_order' => 2,
                'level_name' => 'Alert',
                'level_code' => 'THR_WL_SMP_ALERT',
                'min_value' => 2.00,
                'max_value' => 2.50,
                'color' => 'yellow',
                'color_hex' => '#ffc107',
                'severity' => 'warning',
                'alert_enabled' => true,
                'alert_message' => 'Alert: Water level elevated',
            ],
            [
                'level_order' => 3,
                'level_name' => 'Emergency',
                'level_code' => 'THR_WL_SMP_EMERGENCY',
                'min_value' => 2.50,
                'max_value' => null,
                'color' => 'red',
                'color_hex' => '#dc3545',
                'severity' => 'critical',
                'alert_enabled' => true,
                'alert_message' => 'EMERGENCY: Critical water level',
            ],
        ];

        foreach ($levels as $level) {
            MasSensorThresholdLevel::create(array_merge($level, [
                'threshold_template_code' => $template->code,
            ]));
        }

        $this->command->info('  ✓ Created: Simple Water Level (3 levels)');
    }

    /**
     * Create standard 6-level rainfall threshold template.
     */
    private function createRainfallStandard(): void
    {
        $template = MasSensorThresholdTemplate::create([
            'code' => 'THR_RF_STANDARD',
            'name' => 'Standard Rainfall Thresholds',
            'description' => 'Standard rainfall intensity thresholds',
            'parameter_type' => 'rainfall',
            'unit' => 'mm',
            'is_active' => true,
        ]);

        $levels = [
            [
                'level_order' => 1,
                'level_name' => 'No Rain',
                'level_code' => 'THR_RF_STD_NONE',
                'min_value' => 0.00,
                'max_value' => 0.10,
                'color' => 'lightgray',
                'color_hex' => '#e0e0e0',
                'severity' => 'normal',
                'alert_enabled' => false,
                'alert_message' => 'No rainfall',
            ],
            [
                'level_order' => 2,
                'level_name' => 'Light Rain',
                'level_code' => 'THR_RF_STD_LIGHT',
                'min_value' => 0.10,
                'max_value' => 5.00,
                'color' => 'lightblue',
                'color_hex' => '#b3d9ff',
                'severity' => 'normal',
                'alert_enabled' => false,
                'alert_message' => 'Light rainfall',
            ],
            [
                'level_order' => 3,
                'level_name' => 'Moderate Rain',
                'level_code' => 'THR_RF_STD_MODERATE',
                'min_value' => 5.00,
                'max_value' => 10.00,
                'color' => 'blue',
                'color_hex' => '#0066cc',
                'severity' => 'watch',
                'alert_enabled' => false,
                'alert_message' => 'Moderate rainfall',
            ],
            [
                'level_order' => 4,
                'level_name' => 'Heavy Rain',
                'level_code' => 'THR_RF_STD_HEAVY',
                'min_value' => 10.00,
                'max_value' => 20.00,
                'color' => 'orange',
                'color_hex' => '#ff9933',
                'severity' => 'warning',
                'alert_enabled' => true,
                'alert_message' => 'Heavy rainfall detected',
            ],
            [
                'level_order' => 5,
                'level_name' => 'Very Heavy Rain',
                'level_code' => 'THR_RF_STD_VERYHEAVY',
                'min_value' => 20.00,
                'max_value' => 50.00,
                'color' => 'darkorange',
                'color_hex' => '#ff6600',
                'severity' => 'danger',
                'alert_enabled' => true,
                'alert_message' => 'Very heavy rainfall - flood risk',
            ],
            [
                'level_order' => 6,
                'level_name' => 'Extreme Rain',
                'level_code' => 'THR_RF_STD_EXTREME',
                'min_value' => 50.00,
                'max_value' => null,
                'color' => 'red',
                'color_hex' => '#cc0000',
                'severity' => 'critical',
                'alert_enabled' => true,
                'alert_message' => 'EXTREME rainfall - high flood risk',
            ],
        ];

        foreach ($levels as $level) {
            MasSensorThresholdLevel::create(array_merge($level, [
                'threshold_template_code' => $template->code,
            ]));
        }

        $this->command->info('  ✓ Created: Standard Rainfall (6 levels)');
    }
}

