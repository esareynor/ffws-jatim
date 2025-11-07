<?php

namespace Database\Factories;

use App\Models\DeviceCctv;
use App\Models\MasDevice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DeviceCctv>
 */
class DeviceCctvFactory extends Factory
{
    protected $model = DeviceCctv::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $device = MasDevice::inRandomOrder()->first();
        
        if (!$device) {
            $device = MasDevice::factory()->create();
        }

        $streamTypes = ['rtsp', 'hls', 'mjpeg', 'webrtc', 'youtube'];
        $streamType = $this->faker->randomElement($streamTypes);

        $urls = [
            'rtsp' => 'rtsp://192.168.1.' . $this->faker->numberBetween(100, 200) . ':554/stream1',
            'hls' => 'https://example.com/stream/' . $this->faker->uuid() . '/playlist.m3u8',
            'mjpeg' => 'http://192.168.1.' . $this->faker->numberBetween(100, 200) . '/mjpeg/stream',
            'webrtc' => 'wss://example.com/webrtc/' . $this->faker->uuid(),
            'youtube' => 'https://www.youtube.com/watch?v=' . $this->faker->bothify('??????????'),
        ];

        return [
            'mas_device_code' => $device->code,
            'cctv_url' => $urls[$streamType],
            'stream_type' => $streamType,
            'username' => $streamType === 'rtsp' ? 'admin' : null,
            'password' => $streamType === 'rtsp' ? bcrypt('password') : null,
            'status' => $this->faker->randomElement(['online', 'offline', 'error', 'unknown']),
            'last_check' => $this->faker->optional()->dateTimeBetween('-1 day', 'now'),
            'is_active' => true,
            'description' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the CCTV is online.
     */
    public function online(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'online',
            'is_active' => true,
            'last_check' => now(),
        ]);
    }

    /**
     * Indicate that the CCTV is offline.
     */
    public function offline(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'offline',
            'last_check' => now(),
        ]);
    }

    /**
     * Indicate that the CCTV has an error.
     */
    public function error(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'error',
            'last_check' => now(),
        ]);
    }

    /**
     * Indicate that the CCTV is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that this is an RTSP stream.
     */
    public function rtsp(): static
    {
        return $this->state(fn (array $attributes) => [
            'stream_type' => 'rtsp',
            'cctv_url' => 'rtsp://192.168.1.' . $this->faker->numberBetween(100, 200) . ':554/stream1',
            'username' => 'admin',
            'password' => bcrypt('password'),
        ]);
    }

    /**
     * Indicate that this is an HLS stream.
     */
    public function hls(): static
    {
        return $this->state(fn (array $attributes) => [
            'stream_type' => 'hls',
            'cctv_url' => 'https://example.com/stream/' . $this->faker->uuid() . '/playlist.m3u8',
            'username' => null,
            'password' => null,
        ]);
    }

    /**
     * Indicate that this is a YouTube stream.
     */
    public function youtube(): static
    {
        return $this->state(fn (array $attributes) => [
            'stream_type' => 'youtube',
            'cctv_url' => 'https://www.youtube.com/watch?v=' . $this->faker->bothify('??????????'),
            'username' => null,
            'password' => null,
        ]);
    }
}

