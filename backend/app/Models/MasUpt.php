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

    /**
     * Many-to-many relationship with cities
     * 1 UPT dapat memiliki beberapa City
     */
    public function cities()
    {
        return $this->belongsToMany(
            MasCity::class,
            'mas_city_upt',
            'upt_code',
            'city_code',
            'code',
            'code'
        )->withTimestamps();
    }

    public function uptds()
    {
        return $this->hasMany(MasUptd::class, 'upt_code', 'code');
    }
}

