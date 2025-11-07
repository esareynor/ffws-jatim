<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasUpt extends Model
{
    use HasFactory;

    protected $table = 'mas_upts';

    protected $fillable = [
        'river_basin_code',
        'cities_code',
        'name',
        'code',
    ];

    /**
     * Relationships
     */
    public function riverBasin()
    {
        return $this->belongsTo(MasRiverBasin::class, 'river_basin_code', 'code');
    }

    public function city()
    {
        return $this->belongsTo(MasCity::class, 'cities_code', 'code');
    }

    public function uptds()
    {
        return $this->hasMany(MasUptd::class, 'upt_code', 'code');
    }
}

