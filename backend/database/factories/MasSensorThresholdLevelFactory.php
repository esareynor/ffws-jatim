<?php

namespace Database\Factories;

use App\Models\MasSensorThresholdLevel;
use App\Models\MasSensorThresholdTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MasSensorThresholdLevel>
 */
class MasSensorThresholdLevelFactory extends Factory
{
    protected $model = MasSensorThresholdLevel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $template = MasSensorThresholdTemplate::inRandomOrder()->first();
        
        if (!$template) {
            $template = MasSensorThresholdTemplate::factory()->create();
        }

        $levelNames = ['Normal', 'Watch', 'Warning', 'Danger', 'Critical'];
        $colors = ['green', 'blue', 'yellow', 'orange', 'red'];
        $colorHexes = ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545'];
        $severities = ['normal', 'watch', 'warning', 'danger', 'critical'];
        
        $levelIndex = $this->faker->numberBetween(0, 4);

        return [
            'threshold_template_code' => $template->code,
            'level_order' => $levelIndex + 1,
            'level_name' => $levelNames[$levelIndex],
            'level_code' => $template->code . '_' . strtoupper($levelNames[$levelIndex]),
            'min_value' => $levelIndex * 0.5,
            'max_value' => ($levelIndex + 1) * 0.5,
            'color' => $colors[$levelIndex],
            'color_hex' => $colorHexes[$levelIndex],
            'severity' => $severities[$levelIndex],
            'alert_enabled' => $levelIndex >= 2, // Alert for warning, danger, critical
            'alert_message' => ucfirst($severities[$levelIndex]) . ' level detected',
        ];
    }

    /**
     * Indicate that this is a normal level.
     */
    public function normal(): static
    {
        return $this->state(fn (array $attributes) => [
            'level_order' => 1,
            'level_name' => 'Normal',
            'severity' => 'normal',
            'color' => 'green',
            'color_hex' => '#28a745',
            'alert_enabled' => false,
        ]);
    }

    /**
     * Indicate that this is a critical level.
     */
    public function critical(): static
    {
        return $this->state(fn (array $attributes) => [
            'level_order' => 5,
            'level_name' => 'Critical',
            'severity' => 'critical',
            'color' => 'red',
            'color_hex' => '#dc3545',
            'alert_enabled' => true,
            'max_value' => null, // No upper limit
        ]);
    }
}

