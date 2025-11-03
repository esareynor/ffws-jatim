<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RatingCurve extends Model
{
    use HasFactory;

    protected $fillable = [
        'mas_sensor_code',
        'code',
        'formula_type',
        'a',
        'b',
        'c',
        'effective_date'
    ];

    protected $casts = [
        'a' => 'decimal:6',
        'b' => 'decimal:6',
        'c' => 'decimal:6',
        'effective_date' => 'date',
    ];

    /**
     * Get the sensor that owns the rating curve.
     */
    public function sensor(): BelongsTo
    {
        return $this->belongsTo(MasSensor::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get the calculated discharges for this rating curve.
     */
    public function calculatedDischarges(): HasMany
    {
        return $this->hasMany(CalculatedDischarge::class, 'rating_curve_code', 'code');
    }

    /**
     * Get the predicted calculated discharges for this rating curve.
     */
    public function predictedCalculatedDischarges(): HasMany
    {
        return $this->hasMany(PredictedCalculatedDischarge::class, 'rating_curve_code', 'code');
    }

    /**
     * Calculate discharge from water level using the rating curve formula.
     * 
     * Formula types:
     * - power: Q = C × (H - A)^B  (most common for rating curves)
     * - polynomial: Q = A + B×H + C×H²
     * - exponential: Q = A × e^(B×H)
     * - custom: Q = A × H (simple linear)
     *
     * @param float $waterLevel (H) - Water level in meters
     * @return float Discharge (Q) in m³/s
     */
    public function calculateDischarge(float $waterLevel): float
    {
        return match($this->formula_type) {
            // Q = C × (H - A)^B
            // Where: C = coefficient c, A = offset a, B = exponent b
            'power' => $this->c * pow(max(0, $waterLevel - $this->a), $this->b ?? 1),
            
            // Q = A + B×H + C×H²
            'polynomial' => $this->a + ($this->b ?? 0) * $waterLevel + ($this->c ?? 0) * pow($waterLevel, 2),
            
            // Q = A × e^(B×H)
            'exponential' => $this->a * exp(($this->b ?? 1) * $waterLevel),
            
            // Q = A × H (simple linear)
            'custom' => $this->a * $waterLevel,
            
            default => 0.0
        };
    }

    /**
     * Get formula as string for display.
     */
    public function getFormulaStringAttribute(): string
    {
        return match($this->formula_type) {
            'power' => "Q = {$this->c} × (H - {$this->a})^{$this->b}",
            'polynomial' => "Q = {$this->a} + {$this->b}H + {$this->c}H²",
            'exponential' => "Q = {$this->a} × e^({$this->b}H)",
            'custom' => "Q = {$this->a} × H",
            default => 'Unknown formula'
        };
    }
    
    /**
     * Get formula parameters description.
     */
    public function getFormulaParametersAttribute(): array
    {
        return match($this->formula_type) {
            'power' => [
                'C' => $this->c,
                'A' => $this->a,
                'B' => $this->b,
                'description' => 'Q = C × (H - A)^B'
            ],
            'polynomial' => [
                'A' => $this->a,
                'B' => $this->b,
                'C' => $this->c,
                'description' => 'Q = A + B×H + C×H²'
            ],
            'exponential' => [
                'A' => $this->a,
                'B' => $this->b,
                'description' => 'Q = A × e^(B×H)'
            ],
            'custom' => [
                'A' => $this->a,
                'description' => 'Q = A × H'
            ],
            default => []
        };
    }

    /**
     * Scope for active rating curves (effective as of today).
     */
    public function scopeActive($query)
    {
        return $query->whereDate('effective_date', '<=', now())
            ->orderBy('effective_date', 'desc');
    }

    /**
     * Scope by sensor.
     */
    public function scopeBySensor($query, $sensorCode)
    {
        return $query->where('mas_sensor_code', $sensorCode);
    }

    /**
     * Get the most recent active rating curve for a sensor.
     */
    public static function getActiveForSensor(string $sensorCode, $asOfDate = null): ?self
    {
        $date = $asOfDate ?? now();
        
        return self::where('mas_sensor_code', $sensorCode)
            ->whereDate('effective_date', '<=', $date)
            ->orderBy('effective_date', 'desc')
            ->first();
    }
    
    /**
     * Get rating curve effective for a specific date.
     */
    public static function getForDate(string $sensorCode, $date): ?self
    {
        return self::where('mas_sensor_code', $sensorCode)
            ->whereDate('effective_date', '<=', $date)
            ->orderBy('effective_date', 'desc')
            ->first();
    }
    
    /**
     * Get all rating curves for a sensor with their effective periods.
     */
    public static function getHistoryForSensor(string $sensorCode): array
    {
        $curves = self::where('mas_sensor_code', $sensorCode)
            ->orderBy('effective_date', 'desc')
            ->get();
        
        $history = [];
        foreach ($curves as $index => $curve) {
            $nextCurve = $curves[$index + 1] ?? null;
            
            $history[] = [
                'id' => $curve->id,
                'code' => $curve->code,
                'formula_type' => $curve->formula_type,
                'formula_display' => $curve->formula_string,
                'parameters' => $curve->formula_parameters,
                'effective_from' => $curve->effective_date->format('Y-m-d'),
                'effective_to' => $nextCurve ? $nextCurve->effective_date->subDay()->format('Y-m-d') : 'Present',
                'is_current' => $index === 0,
                'usage_count' => $curve->calculatedDischarges()->count()
            ];
        }
        
        return $history;
    }
}

