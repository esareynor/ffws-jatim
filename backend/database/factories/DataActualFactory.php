<?php

namespace Database\Factories;

use App\Models\MasSensor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DataActual>
 */
class DataActualFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sensor = MasSensor::inRandomOrder()->first();
        $value = $this->faker->randomFloat(2, 0, 20);
        $status = 'safe';
        if ($sensor) {
            if ($value >= $sensor->threshold_danger) {
                $status = 'danger';
            } elseif ($value >= $sensor->threshold_warning) {
                $status = 'warning';
            }
        }


        return [
            'mas_sensor_id' => $sensor->id,
            'mas_sensor_code' => $sensor->code,
            'value' => $value,
            'received_at' => $this->faker->dateTimeThisMonth(),
            'threshold_status' => $status,
        ];
    }
}
