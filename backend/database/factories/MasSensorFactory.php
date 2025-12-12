<?php

namespace Database\Factories;

use App\Models\MasDevice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MasSensor>
 */
class MasSensorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $parameter = $this->faker->randomElement(['water_level', 'rainfall']);
        $unit = ($parameter === 'water_level') ? 'm' : 'mm';

        return [
            'device_id' => MasDevice::inRandomOrder()->first()->id,
            'code' => $this->faker->unique()->bothify('SENSOR-####'),
            'parameter' => $parameter,
            'unit' => $unit,
            'description' => $this->faker->sentence,
            'mas_model_id' => null,
            'threshold_safe' => $this->faker->randomFloat(2, 1, 5),
            'threshold_warning' => $this->faker->randomFloat(2, 5, 10),
            'threshold_danger' => $this->faker->randomFloat(2, 10, 15),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'last_seen' => $this->faker->dateTimeThisMonth(),
        ];
    }
}
