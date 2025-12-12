<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SensorValue extends Model
{
    use HasFactory;

    protected $table = 'sensor_values';

    protected $fillable = [
        'mas_sensor_code',
        'mas_sensor_parameter_code',
        'mas_sensor_threshold_code',
        'sensor_name',
        'sensor_unit',
        'sensor_description',
        'sensor_icon_path',
        'status',
        'last_seen',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_seen' => 'datetime',
    ];

    /**
     * Get the sensor that owns this sensor value.
     */
    public function sensor(): BelongsTo
    {
        return $this->belongsTo(MasSensor::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get the sensor parameter.
     */
    public function sensorParameter(): BelongsTo
    {
        return $this->belongsTo(MasSensorParameter::class, 'mas_sensor_parameter_code', 'code');
    }

    /**
     * Get the threshold template assigned to this sensor value.
     */
    public function thresholdTemplate(): BelongsTo
    {
        return $this->belongsTo(MasSensorThresholdTemplate::class, 'mas_sensor_threshold_code', 'code');
    }

    /**
     * Scope for active sensor values only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where('status', 'active');
    }

    /**
     * Scope for inactive or fault sensor values.
     */
    public function scopeInactive($query)
    {
        return $query->where(function ($q) {
            $q->where('is_active', false)
              ->orWhere('status', '!=', 'active');
        });
    }

    /**
     * Scope by sensor code.
     */
    public function scopeBySensorCode($query, $sensorCode)
    {
        return $query->where('mas_sensor_code', $sensorCode);
    }

    /**
     * Scope by parameter code.
     */
    public function scopeByParameterCode($query, $parameterCode)
    {
        return $query->where('mas_sensor_parameter_code', $parameterCode);
    }

    /**
     * Scope for sensors seen recently (within specified minutes).
     */
    public function scopeSeenRecently($query, $minutes = 60)
    {
        return $query->where('last_seen', '>=', now()->subMinutes($minutes));
    }

    /**
     * Check if sensor value is online.
     */
    public function isOnline($minutes = 60): bool
    {
        if (!$this->last_seen) {
            return false;
        }

        return $this->last_seen->greaterThan(now()->subMinutes($minutes));
    }
}
