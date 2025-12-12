<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasSensor extends Model
{
    use HasFactory;

    protected $fillable = [
        'mas_device_code',
        'code',
        'parameter',
        'unit',
        'description',
        'mas_model_code',
        'threshold_safe',
        'threshold_warning',
        'threshold_danger',
        'status',
        'forecasting_status',
        'is_active',
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
        return $this->belongsTo(MasDevice::class, 'mas_device_code', 'code');
    }

    /**
     * Get the model that owns the sensor.
     */
    public function masModel(): BelongsTo
    {
        return $this->belongsTo(MasModel::class, 'mas_model_code', 'code');
    }

    /**
     * Get the latest data for this sensor.
     */
    public function latestData()
    {
        return $this->hasOne(DataActual::class, 'mas_sensor_code', 'code')->latest('received_at');
    }

    /**
     * Get all data for this sensor.
     */
    public function dataActuals()
    {
        return $this->hasMany(DataActual::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get rating curves for this sensor.
     */
    public function ratingCurves()
    {
        return $this->hasMany(RatingCurve::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get the active rating curve for this sensor.
     */
    public function activeRatingCurve()
    {
        return $this->hasOne(RatingCurve::class, 'mas_sensor_code', 'code')
            ->whereDate('effective_date', '<=', now())
            ->orderBy('effective_date', 'desc');
    }

    /**
     * Get calculated discharges for this sensor.
     */
    public function calculatedDischarges()
    {
        return $this->hasMany(CalculatedDischarge::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get data predictions for this sensor.
     */
    public function dataPredictions()
    {
        return $this->hasMany(DataPrediction::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get predicted calculated discharges for this sensor.
     */
    public function predictedCalculatedDischarges()
    {
        return $this->hasMany(PredictedCalculatedDischarge::class, 'mas_sensor_code', 'code');
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
