<?php

namespace Database\Factories;

use App\Models\MasSensorThresholdAssignment;
use App\Models\MasSensor;
use App\Models\MasSensorThresholdTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MasSensorThresholdAssignment>
 */
class MasSensorThresholdAssignmentFactory extends Factory
{
    protected $model = MasSensorThresholdAssignment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sensor = MasSensor::inRandomOrder()->first();
        $template = MasSensorThresholdTemplate::inRandomOrder()->first();
        
        if (!$sensor) {
            $sensor = MasSensor::factory()->create();
        }
        
        if (!$template) {
            $template = MasSensorThresholdTemplate::factory()->create();
        }

        return [
            'mas_sensor_code' => $sensor->code,
            'threshold_template_code' => $template->code,
            'effective_from' => Carbon::now()->subMonths($this->faker->numberBetween(1, 12)),
            'effective_to' => null, // Ongoing by default
            'is_active' => true,
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the assignment has ended.
     */
    public function ended(): static
    {
        return $this->state(fn (array $attributes) => [
            'effective_to' => Carbon::now()->subDays($this->faker->numberBetween(1, 30)),
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the assignment is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the assignment is for a specific date range.
     */
    public function dateRange(Carbon $from, ?Carbon $to = null): static
    {
        return $this->state(fn (array $attributes) => [
            'effective_from' => $from,
            'effective_to' => $to,
        ]);
    }
}

