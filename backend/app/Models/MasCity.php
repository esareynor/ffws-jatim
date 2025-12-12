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
    ];

    /**
     * Relationships
     */
    public function riverBasins()
    {
        return $this->hasMany(MasRiverBasin::class, 'cities_code', 'code');
    }

    public function upts()
    {
        return $this->hasMany(MasUpt::class, 'cities_code', 'code');
    }
}

