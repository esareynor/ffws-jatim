<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasSensorParameter extends Model
{
    use HasFactory;

    protected $table = 'mas_sensor_parameters';

    protected $fillable = [
        'name',
        'code',
    ];
}

