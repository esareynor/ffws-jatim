<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GeojsonMapping extends Model
{
    use HasFactory;

    protected $table = 'geojson_mapping';

    protected $fillable = [
        'geojson_code',
        'mas_device_code',
        'mas_river_basin_code',
        'mas_watershed_code',
        'mas_city_code',
        'mas_regency_code',
        'mas_village_code',
        'mas_upt_code',
        'mas_uptd_code',
        'mas_device_parameter_code',
        'code',
        'value_min',
        'value_max',
        'file_path',
        'version',
        'description',
        'properties_content'
    ];

    protected $casts = [
        'value_min' => 'decimal:4',
        'value_max' => 'decimal:4',
        'properties_content' => 'array'
    ];

    /**
     * Get the device.
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
     * Scope by device.
     */
    public function scopeByDevice($query, $deviceCode)
    {
        return $query->where('mas_device_code', $deviceCode);
    }

    /**
     * Scope by river basin.
     */
    public function scopeByRiverBasin($query, $basinCode)
    {
        return $query->where('mas_river_basin_code', $basinCode);
    }

    /**
     * Scope by city.
     */
    public function scopeByCity($query, $cityCode)
    {
        return $query->where('mas_city_code', $cityCode);
    }
}

