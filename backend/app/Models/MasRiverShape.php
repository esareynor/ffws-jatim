<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasRiverShape extends Model
{
    use HasFactory;

    protected $table = 'mas_river_shape';

    protected $fillable = [
        'code',
        'sensor_code',
        'array_codes',
        'x',
        'y',
        'a',
        'b',
        'c',
    ];

    protected $casts = [
        'array_codes' => 'array',
        'x' => 'decimal:6',
        'y' => 'decimal:6',
        'a' => 'decimal:6',
        'b' => 'decimal:6',
        'c' => 'decimal:6',
    ];

    /**
     * Get the sensor that owns this river shape.
     */
    public function sensor(): BelongsTo
    {
        return $this->belongsTo(MasSensor::class, 'sensor_code', 'code');
    }

    /**
     * Scope for active sensors only.
     */
    public function scopeActiveSensors($query)
    {
        return $query->whereHas('sensor', function ($q) {
            $q->where('status', 'active');
        });
    }

    /**
     * Scope by sensor code.
     */
    public function scopeBySensorCode($query, $sensorCode)
    {
        return $query->where('sensor_code', $sensorCode);
    }
}
