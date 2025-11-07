<?php

namespace Database\Factories;

use App\Models\MasSensorThresholdTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MasSensorThresholdTemplate>
 */
class MasSensorThresholdTemplateFactory extends Factory
{
    protected $model = MasSensorThresholdTemplate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $parameterTypes = ['water_level', 'rainfall', 'discharge', 'temperature'];
        $parameterType = $this->faker->randomElement($parameterTypes);
        
        $units = [
            'water_level' => 'meter',
            'rainfall' => 'mm',
            'discharge' => 'm³/s',
            'temperature' => '°C',
        ];

        return [
            'code' => 'THR_' . strtoupper(substr($parameterType, 0, 2)) . '_' . $this->faker->unique()->numberBetween(1000, 9999),
            'name' => ucfirst($parameterType) . ' Threshold Template',
            'description' => 'Threshold template for ' . str_replace('_', ' ', $parameterType),
            'parameter_type' => $parameterType,
            'unit' => $units[$parameterType],
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the template is for water level.
     */
    public function waterLevel(): static
    {
        return $this->state(fn (array $attributes) => [
            'parameter_type' => 'water_level',
            'unit' => 'meter',
            'name' => 'Water Level Threshold Template',
        ]);
    }

    /**
     * Indicate that the template is for rainfall.
     */
    public function rainfall(): static
    {
        return $this->state(fn (array $attributes) => [
            'parameter_type' => 'rainfall',
            'unit' => 'mm',
            'name' => 'Rainfall Threshold Template',
        ]);
    }

    /**
     * Indicate that the template is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}

