<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasSensorThresholdTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'parameter_type',
        'unit',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all threshold levels for this template.
     */
    public function levels(): HasMany
    {
        return $this->hasMany(MasSensorThresholdLevel::class, 'threshold_template_code', 'code')
            ->orderBy('level_order');
    }

    /**
     * Get sensor assignments for this template.
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(MasSensorThresholdAssignment::class, 'threshold_template_code', 'code');
    }

    /**
     * Get active assignments.
     */
    public function activeAssignments(): HasMany
    {
        return $this->assignments()
            ->where('is_active', true)
            ->where(function($query) {
                $query->whereNull('effective_to')
                      ->orWhere('effective_to', '>=', now()->toDateString());
            });
    }

    /**
     * Scope to filter by parameter type.
     */
    public function scopeByParameter($query, $parameterType)
    {
        return $query->where('parameter_type', $parameterType);
    }

    /**
     * Scope to filter active templates.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the threshold level for a given value.
     */
    public function getLevelForValue(float $value): ?MasSensorThresholdLevel
    {
        return $this->levels()
            ->where('min_value', '<=', $value)
            ->where(function($query) use ($value) {
                $query->whereNull('max_value')
                      ->orWhere('max_value', '>', $value);
            })
            ->first();
    }

    /**
     * Get formatted threshold levels as array.
     */
    public function getFormattedLevelsAttribute(): array
    {
        return $this->levels->map(function($level) {
            return [
                'order' => $level->level_order,
                'name' => $level->level_name,
                'code' => $level->level_code,
                'range' => [
                    'min' => $level->min_value,
                    'max' => $level->max_value,
                ],
                'display' => $level->min_value . ' - ' . ($level->max_value ?? '∞') . ' ' . $this->unit,
                'color' => $level->color,
                'color_hex' => $level->color_hex,
                'severity' => $level->severity,
                'alert_enabled' => $level->alert_enabled,
            ];
        })->toArray();
    }
}

