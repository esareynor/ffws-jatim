<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasVillage extends Model
{
    use HasFactory;

    protected $table = 'mas_villages';

    protected $fillable = [
        'name',
        'code',
    ];
}

