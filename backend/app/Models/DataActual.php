<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DataActual extends Model
{
    use HasFactory;

    protected $fillable = [
        'mas_sensor_code',
        'value',
        'received_at',
        'threshold_status'
    ];

    protected $casts = [
        'value' => 'double',
        'received_at' => 'datetime',
    ];

    /**
     * Get the sensor that owns the data actual.
     */
    public function sensor(): BelongsTo
    {
        return $this->belongsTo(MasSensor::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get calculated discharges for this data actual
     */
    public function calculatedDischarges(): HasMany
    {
        return $this->hasMany(CalculatedDischarge::class, 'data_actual_id');
    }

    /**
     * Get threshold status badge class
     */
    public function getThresholdStatusBadgeClass(): string
    {
        return match($this->threshold_status) {
            'safe' => 'bg-green-100 text-green-800',
            'warning' => 'bg-yellow-100 text-yellow-800',
            'danger' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    /**
     * Get threshold status label
     */
    public function getThresholdStatusLabel(): string
    {
        return match($this->threshold_status) {
            'safe' => 'Aman',
            'warning' => 'Waspada',
            'danger' => 'Bahaya',
            default => 'Tidak Diketahui'
        };
    }

    /**
     * Scope untuk filter berdasarkan status threshold
     */
    public function scopeByThresholdStatus($query, $status)
    {
        return $query->where('threshold_status', $status);
    }

    /**
     * Scope untuk filter berdasarkan tanggal
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('received_at', [$startDate, $endDate]);
    }

    /**
     * Calculate threshold status based on sensor thresholds
     */
    public function calculateThresholdStatus($sensor): string
    {
        if (!$sensor) {
            return 'safe';
        }

        // Get thresholds from sensor
        $thresholdSafe = $sensor->threshold_safe ?? 1.0;
        $thresholdWarning = $sensor->threshold_warning ?? 2.0;
        $thresholdDanger = $sensor->threshold_danger ?? 3.0;

        // Determine status based on value
        if ($this->value >= $thresholdDanger) {
            return 'danger';
        } elseif ($this->value >= $thresholdWarning) {
            return 'warning';
        } else {
            return 'safe';
        }
    }
}
