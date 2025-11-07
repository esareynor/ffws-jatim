<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasSensorThreshold extends Model
{
    use HasFactory;

    protected $table = 'mas_sensor_thresholds';

    protected $fillable = [
        'sensor_thresholds_name',
        'sensor_thresholds_code',
        'sensor_thresholds_value_1',
        'sensor_thresholds_value_1_color',
        'sensor_thresholds_value_2',
        'sensor_thresholds_value_2_color',
        'sensor_thresholds_value_3',
        'sensor_thresholds_value_3_color',
        'sensor_thresholds_value_4',
        'sensor_thresholds_value_4_color',
    ];

    protected $casts = [
        'sensor_thresholds_value_1' => 'decimal:3',
        'sensor_thresholds_value_2' => 'decimal:3',
        'sensor_thresholds_value_3' => 'decimal:3',
        'sensor_thresholds_value_4' => 'decimal:3',
    ];
}

