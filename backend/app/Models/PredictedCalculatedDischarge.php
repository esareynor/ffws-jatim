<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PredictedCalculatedDischarge extends Model
{
    use HasFactory;

    protected $fillable = [
        'mas_sensor_code',
        'water_level',
        'discharge',
        'rating_curve_code',
        'predicted_at'
    ];

    protected $casts = [
        'water_level' => 'decimal:4',
        'discharge' => 'decimal:4',
        'predicted_at' => 'datetime',
    ];

    /**
     * Get the sensor that owns the predicted calculated discharge.
     */
    public function sensor(): BelongsTo
    {
        return $this->belongsTo(MasSensor::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get the rating curve used for this calculation.
     */
    public function ratingCurve(): BelongsTo
    {
        return $this->belongsTo(RatingCurve::class, 'rating_curve_code', 'code');
    }

    /**
     * Scope by sensor.
     */
    public function scopeBySensor($query, $sensorCode)
    {
        return $query->where('mas_sensor_code', $sensorCode);
    }

    /**
     * Scope by date range.
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('calculated_at', [$startDate, $endDate]);
    }

    /**
     * Scope for future predictions.
     */
    public function scopeFuture($query)
    {
        return $query->where('calculated_at', '>', now());
    }

    /**
     * Scope for latest calculations.
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('calculated_at', 'desc');
    }
}

