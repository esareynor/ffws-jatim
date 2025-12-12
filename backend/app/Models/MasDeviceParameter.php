<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasDeviceParameter extends Model
{
    use HasFactory;

    protected $table = 'mas_device_parameters';

    protected $fillable = [
        'name',
        'code',
    ];
}

