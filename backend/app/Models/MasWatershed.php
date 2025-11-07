<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasWatershed extends Model
{
    use HasFactory;

    protected $table = 'mas_watersheds';

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
}

