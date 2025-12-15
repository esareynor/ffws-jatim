<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SensorApiMapping extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_data_source_id',
        'mas_sensor_code',
        'mas_device_code',
        'external_sensor_id',
        'field_mapping',
        'is_active',
    ];

    protected $casts = [
        'field_mapping' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the data source for this mapping
     */
    public function dataSource(): BelongsTo
    {
        return $this->belongsTo(ApiDataSource::class, 'api_data_source_id');
    }

    /**
     * Get the sensor for this mapping
     */
    public function sensor(): BelongsTo
    {
        return $this->belongsTo(MasSensor::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get the device for this mapping
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(MasDevice::class, 'mas_device_code', 'code');
    }
}
