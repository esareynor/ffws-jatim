<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasRegency extends Model
{
    use HasFactory;

    protected $table = 'mas_regencies';

    protected $fillable = [
        'regencies_name',
        'regencies_code',
        'cities_code',
    ];

    /**
     * Get the city that owns the regency
     */
    public function city()
    {
        return $this->belongsTo(MasCity::class, 'cities_code', 'code');
    }

    /**
     * Get villages that belong to this regency
     */
    public function villages()
    {
        return $this->hasMany(MasVillage::class, 'regencies_code', 'regencies_code');
    }
}

