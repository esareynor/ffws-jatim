<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasSensorThresholdLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'threshold_template_code',
        'level_order',
        'level_name',
        'level_code',
        'min_value',
        'max_value',
        'color',
        'color_hex',
        'severity',
        'alert_enabled',
        'alert_message',
    ];

    protected $casts = [
        'min_value' => 'decimal:4',
        'max_value' => 'decimal:4',
        'level_order' => 'integer',
        'alert_enabled' => 'boolean',
    ];

    /**
     * Get the template that owns this level.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(MasSensorThresholdTemplate::class, 'threshold_template_code', 'code');
    }

    /**
     * Check if a value falls within this threshold level.
     */
    public function containsValue(float $value): bool
    {
        $aboveMin = $value >= $this->min_value;
        $belowMax = $this->max_value === null || $value < $this->max_value;
        
        return $aboveMin && $belowMax;
    }

    /**
     * Get formatted range display.
     */
    public function getRangeDisplayAttribute(): string
    {
        $unit = $this->template->unit ?? '';
        $max = $this->max_value ?? '∞';
        return "{$this->min_value} - {$max} {$unit}";
    }

    /**
     * Get severity level as integer (for comparison).
     */
    public function getSeverityLevelAttribute(): int
    {
        return match($this->severity) {
            'normal' => 1,
            'watch' => 2,
            'warning' => 3,
            'danger' => 4,
            'critical' => 5,
            default => 0,
        };
    }

    /**
     * Scope to filter by severity.
     */
    public function scopeBySeverity($query, $severity)
    {
        return $query->where('severity', $severity);
    }

    /**
     * Scope to filter alert-enabled levels.
     */
    public function scopeAlertEnabled($query)
    {
        return $query->where('alert_enabled', true);
    }

    /**
     * Scope to order by level order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('level_order');
    }
}

