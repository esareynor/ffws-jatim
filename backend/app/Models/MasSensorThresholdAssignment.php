<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class MasSensorThresholdAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'mas_sensor_code',
        'threshold_template_code',
        'effective_from',
        'effective_to',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_to' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the sensor for this assignment.
     */
    public function sensor(): BelongsTo
    {
        return $this->belongsTo(MasSensor::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get the threshold template for this assignment.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(MasSensorThresholdTemplate::class, 'threshold_template_code', 'code');
    }

    /**
     * Check if assignment is currently effective.
     */
    public function isEffective(?Carbon $date = null): bool
    {
        $date = $date ?? now();
        
        $afterStart = $date->greaterThanOrEqualTo($this->effective_from);
        $beforeEnd = $this->effective_to === null || $date->lessThanOrEqualTo($this->effective_to);
        
        return $this->is_active && $afterStart && $beforeEnd;
    }

    /**
     * Scope to filter by sensor.
     */
    public function scopeBySensor($query, $sensorCode)
    {
        return $query->where('mas_sensor_code', $sensorCode);
    }

    /**
     * Scope to filter active assignments.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter currently effective assignments.
     */
    public function scopeEffective($query, ?Carbon $date = null)
    {
        $date = $date ?? now();
        
        return $query->where('is_active', true)
            ->where('effective_from', '<=', $date->toDateString())
            ->where(function($q) use ($date) {
                $q->whereNull('effective_to')
                  ->orWhere('effective_to', '>=', $date->toDateString());
            });
    }

    /**
     * Get the active threshold template for a sensor.
     */
    public static function getActiveTemplateForSensor(string $sensorCode, ?Carbon $date = null): ?MasSensorThresholdTemplate
    {
        $assignment = self::bySensor($sensorCode)
            ->effective($date)
            ->with('template.levels')
            ->first();
        
        return $assignment?->template;
    }

    /**
     * Get the threshold level for a sensor value.
     */
    public static function getLevelForSensorValue(string $sensorCode, float $value, ?Carbon $date = null): ?MasSensorThresholdLevel
    {
        $template = self::getActiveTemplateForSensor($sensorCode, $date);
        
        if (!$template) {
            return null;
        }
        
        return $template->getLevelForValue($value);
    }
}

