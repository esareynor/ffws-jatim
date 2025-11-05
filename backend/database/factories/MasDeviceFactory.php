<?php

namespace Database\Factories;

use App\Models\MasRiverBasin;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MasDevice>
 */
class MasDeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mas_river_basin_code' => MasRiverBasin::inRandomOrder()->first()->code,
            'name' => 'AWS ' . $this->faker->city(),
            'code' => 'DEV-' . strtoupper($this->faker->unique()->bothify('???-###')),
            'latitude' => $this->faker->latitude(-8.5, -7.0), // Jawa Timur range
            'longitude' => $this->faker->longitude(111.0, 114.5), // Jawa Timur range
            'elevation_m' => $this->faker->randomFloat(2, 5, 1000),
            'status' => $this->faker->randomElement(['active', 'inactive', 'maintenance']),
        ];
    }
}
