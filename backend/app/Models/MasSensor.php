<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasSensor extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'sensor_code',
        'parameter',
        'unit',
        'description',
        'mas_model_id',
        'threshold_safe',
        'threshold_warning',
        'threshold_danger',
        'status',
        'last_seen'
    ];

    protected $casts = [
        'threshold_safe' => 'double',
        'threshold_warning' => 'double',
        'threshold_danger' => 'double',
        'last_seen' => 'datetime',
    ];

    /**
     * Get the device that owns the sensor.
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(MasDevice::class, 'device_id');
    }

    /**
     * Get the model that owns the sensor.
     */
    public function masModel(): BelongsTo
    {
        return $this->belongsTo(MasModel::class, 'mas_model_id');
    }

    /**
     * Get the latest data for this sensor.
     */
    public function latestData()
    {
        return $this->hasOne(DataActual::class, 'mas_sensor_id')->latest('received_at');
    }

    /**
     * Get all data for this sensor.
     */
    public function dataActuals()
    {
        return $this->hasMany(DataActual::class, 'mas_sensor_id');
    }

    /**
     * Get the parameter options.
     */
    public static function getParameterOptions(): array
    {
        return [
            'water_level' => 'Water Level',
            'rainfall' => 'Rainfall'
        ];
    }

    /**
     * Get the status options.
     */
    public static function getStatusOptions(): array
    {
        return [
            'active' => 'Active',
            'inactive' => 'Inactive'
        ];
    }
}
