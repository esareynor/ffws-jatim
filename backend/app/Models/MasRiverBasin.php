<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasRiverBasin extends Model
{
    use HasFactory;

    protected $table = 'mas_river_basins';

    protected $fillable = [
        'name',
        'code',
        'cities_code',
    ];

    /**
     * Get the city that owns the river basin.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(MasCity::class, 'cities_code', 'code');
    }

    /**
     * Get the watersheds (DAS) for this river basin (Wilayah Sungai).
     * 1 River Basin → Many Watersheds
     */
    public function watersheds(): HasMany
    {
        return $this->hasMany(MasWatershed::class, 'river_basin_code', 'code');
    }

    /**
     * Get the devices in this river basin.
     */
    public function devices(): HasMany
    {
        return $this->hasMany(MasDevice::class, 'mas_river_basin_code', 'code');
    }
}
