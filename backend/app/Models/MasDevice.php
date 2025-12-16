<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'mas_river_basin_code',
        'latitude',
        'longitude',
        'elevation_m',
        'status'
    ];

    /**
     * Get the route key for the model.
     * This allows using 'code' instead of 'id' in routes
     */
    public function getRouteKeyName()
    {
        return 'code';
    }

    public function riverBasin()
    {
        return $this->belongsTo(MasRiverBasin::class, 'mas_river_basin_code', 'code');
    }

    public function sensors()
    {
        return $this->hasMany(MasSensor::class, 'mas_device_code', 'code');
    }
}
