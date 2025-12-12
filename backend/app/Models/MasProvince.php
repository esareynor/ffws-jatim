<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasProvince extends Model
{
    use HasFactory;

    protected $table = 'mas_provinces';

    protected $fillable = [
        'provinces_name',
        'provinces_code',
    ];
}

