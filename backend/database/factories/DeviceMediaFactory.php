<?php

namespace Database\Factories;

use App\Models\DeviceMedia;
use App\Models\MasDevice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DeviceMedia>
 */
class DeviceMediaFactory extends Factory
{
    protected $model = DeviceMedia::class;

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

        $mediaTypes = ['image', 'video', 'document', 'cctv_snapshot', 'thumbnail'];
        $mediaType = $this->faker->randomElement($mediaTypes);

        $mimeTypes = [
            'image' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            'video' => ['video/mp4', 'video/avi', 'video/mov', 'video/webm'],
            'document' => ['application/pdf', 'application/msword', 'application/vnd.ms-excel'],
            'cctv_snapshot' => ['image/jpeg', 'image/png'],
            'thumbnail' => ['image/jpeg', 'image/png'],
        ];

        $extensions = [
            'image' => ['jpg', 'png', 'gif', 'webp'],
            'video' => ['mp4', 'avi', 'mov', 'webm'],
            'document' => ['pdf', 'doc', 'xls'],
            'cctv_snapshot' => ['jpg', 'png'],
            'thumbnail' => ['jpg', 'png'],
        ];

        $mimeType = $this->faker->randomElement($mimeTypes[$mediaType]);
        $extension = $this->faker->randomElement($extensions[$mediaType]);
        $fileName = Str::slug($this->faker->words(3, true)) . '.' . $extension;
        $filePath = "devices/{$device->code}/{$mediaType}s/{$fileName}";

        return [
            'mas_device_code' => $device->code,
            'media_type' => $mediaType,
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph(),
            'file_path' => $filePath,
            'file_name' => $fileName,
            'file_size' => $this->faker->numberBetween(10240, 10485760), // 10KB to 10MB
            'mime_type' => $mimeType,
            'file_hash' => hash('sha256', $filePath . time()),
            'disk' => 'public',
            'is_primary' => false,
            'is_public' => true,
            'display_order' => $this->faker->numberBetween(0, 100),
            'captured_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'uploaded_by' => User::inRandomOrder()->first()?->id,
            'tags' => $this->faker->optional()->randomElements(
                ['installation', 'maintenance', 'inspection', 'flood', 'normal', 'damage'],
                $this->faker->numberBetween(1, 3)
            ),
            'metadata' => [
                'camera' => $this->faker->optional()->randomElement(['Canon EOS', 'Nikon D850', 'Sony A7', 'iPhone 13']),
                'resolution' => $this->faker->optional()->randomElement(['1920x1080', '3840x2160', '1280x720']),
                'location' => $this->faker->optional()->address(),
            ],
        ];
    }

    /**
     * Indicate that this is an image.
     */
    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'media_type' => 'image',
            'mime_type' => $this->faker->randomElement(['image/jpeg', 'image/png']),
            'file_path' => "devices/{$attributes['mas_device_code']}/images/" . Str::slug($this->faker->words(3, true)) . '.jpg',
        ]);
    }

    /**
     * Indicate that this is a video.
     */
    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'media_type' => 'video',
            'mime_type' => 'video/mp4',
            'file_path' => "devices/{$attributes['mas_device_code']}/videos/" . Str::slug($this->faker->words(3, true)) . '.mp4',
            'file_size' => $this->faker->numberBetween(1048576, 104857600), // 1MB to 100MB
        ]);
    }

    /**
     * Indicate that this is a document.
     */
    public function document(): static
    {
        return $this->state(fn (array $attributes) => [
            'media_type' => 'document',
            'mime_type' => 'application/pdf',
            'file_path' => "devices/{$attributes['mas_device_code']}/documents/" . Str::slug($this->faker->words(3, true)) . '.pdf',
        ]);
    }

    /**
     * Indicate that this is a CCTV snapshot.
     */
    public function cctvSnapshot(): static
    {
        return $this->state(fn (array $attributes) => [
            'media_type' => 'cctv_snapshot',
            'mime_type' => 'image/jpeg',
            'file_path' => "devices/{$attributes['mas_device_code']}/cctv/" . Str::slug($this->faker->words(3, true)) . '.jpg',
            'captured_at' => now(),
        ]);
    }

    /**
     * Indicate that this is a thumbnail.
     */
    public function thumbnail(): static
    {
        return $this->state(fn (array $attributes) => [
            'media_type' => 'thumbnail',
            'mime_type' => 'image/jpeg',
            'file_path' => "devices/{$attributes['mas_device_code']}/thumbnails/" . Str::slug($this->faker->words(3, true)) . '.jpg',
            'file_size' => $this->faker->numberBetween(5120, 51200), // 5KB to 50KB
        ]);
    }

    /**
     * Indicate that this is the primary media.
     */
    public function primary(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_primary' => true,
            'display_order' => 0,
        ]);
    }

    /**
     * Indicate that this is private media.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => false,
        ]);
    }
}

