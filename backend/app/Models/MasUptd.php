<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasUptd extends Model
{
    use HasFactory;

    protected $table = 'mas_uptds';

    protected $fillable = [
        'upt_code',
        'name',
        'code',
    ];

    /**
     * Relationships
     */
    public function upt()
    {
        return $this->belongsTo(MasUpt::class, 'upt_code', 'code');
    }
}

