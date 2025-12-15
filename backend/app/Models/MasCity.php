<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasCity extends Model
{
    use HasFactory;

    protected $table = 'mas_cities';

    protected $fillable = [
        'name',
        'code',
        'provinces_code',
    ];

    /**
     * Get the province that owns the city
     */
    public function province()
    {
        return $this->belongsTo(MasProvince::class, 'provinces_code', 'provinces_code');
    }

    /**
     * Get regencies that belong to this city
     */
    public function regencies()
    {
        return $this->hasMany(MasRegency::class, 'cities_code', 'code');
    }

    /**
     * Other relationships
     */
    public function riverBasins()
    {
        return $this->hasMany(MasRiverBasin::class, 'cities_code', 'code');
    }

    /**
     * Many-to-many relationship with UPTs
     * 1 City dapat dimiliki oleh beberapa UPT
     */
    public function upts()
    {
        return $this->belongsToMany(
            MasUpt::class,
            'mas_city_upt',
            'city_code',
            'upt_code',
            'code',
            'code'
        )->withTimestamps();
    }

    /**
     * Get UPTDs in this city
     */
    public function uptds()
    {
        return $this->hasMany(MasUptd::class, 'city_code', 'code');
    }
}

