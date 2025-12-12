<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeviceValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'mas_device_code',
        'mas_river_basin_code',
        'mas_watershed_code',
        'mas_city_code',
        'mas_regency_code',
        'mas_village_code',
        'mas_upt_code',
        'mas_uptd_code',
        'mas_device_parameter_code',
        'name',
        'icon_path',
        'latitude',
        'longitude',
        'elevation',
        'status',
        'description',
        'installation_date',
        'last_maintenance',
        'next_maintenance',
    ];

    protected $casts = [
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'elevation' => 'decimal:2',
        'installation_date' => 'date',
        'last_maintenance' => 'date',
        'next_maintenance' => 'date',
    ];

    /**
     * Get the device for this value.
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(MasDevice::class, 'mas_device_code', 'code');
    }

    /**
     * Get the river basin.
     */
    public function riverBasin(): BelongsTo
    {
        return $this->belongsTo(MasRiverBasin::class, 'mas_river_basin_code', 'code');
    }

    /**
     * Get the watershed.
     */
    public function watershed(): BelongsTo
    {
        return $this->belongsTo(MasWatershed::class, 'mas_watershed_code', 'code');
    }

    /**
     * Get the city.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(MasCity::class, 'mas_city_code', 'code');
    }

    /**
     * Get the regency.
     */
    public function regency(): BelongsTo
    {
        return $this->belongsTo(MasRegency::class, 'mas_regency_code', 'regencies_code');
    }

    /**
     * Get the village.
     */
    public function village(): BelongsTo
    {
        return $this->belongsTo(MasVillage::class, 'mas_village_code', 'code');
    }

    /**
     * Get the UPT.
     */
    public function upt(): BelongsTo
    {
        return $this->belongsTo(MasUpt::class, 'mas_upt_code', 'code');
    }

    /**
     * Get the UPTD.
     */
    public function uptd(): BelongsTo
    {
        return $this->belongsTo(MasUptd::class, 'mas_uptd_code', 'code');
    }

    /**
     * Get the device parameter.
     */
    public function deviceParameter(): BelongsTo
    {
        return $this->belongsTo(MasDeviceParameter::class, 'mas_device_parameter_code', 'code');
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter active devices.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to filter by device.
     */
    public function scopeByDevice($query, $deviceCode)
    {
        return $query->where('mas_device_code', $deviceCode);
    }

    /**
     * Check if maintenance is due.
     */
    public function isMaintenanceDue(): bool
    {
        if (!$this->next_maintenance) {
            return false;
        }

        return $this->next_maintenance->isPast();
    }

    /**
     * Get days until next maintenance.
     */
    public function daysUntilMaintenance(): ?int
    {
        if (!$this->next_maintenance) {
            return null;
        }

        return now()->diffInDays($this->next_maintenance, false);
    }

    /**
     * Get formatted location.
     */
    public function getFormattedLocationAttribute(): string
    {
        if ($this->latitude && $this->longitude) {
            return "{$this->latitude}, {$this->longitude}";
        }

        return 'Not set';
    }

    /**
     * Get status badge color.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'active' => 'green',
            'inactive' => 'gray',
            'pending' => 'yellow',
            'maintenance' => 'orange',
            default => 'gray'
        };
    }
}

