<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApiDataFetchLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_data_source_id',
        'fetched_at',
        'status',
        'records_fetched',
        'records_saved',
        'records_failed',
        'error_message',
        'response_summary',
        'duration_ms',
    ];

    protected $casts = [
        'fetched_at' => 'datetime',
        'response_summary' => 'array',
        'records_fetched' => 'integer',
        'records_saved' => 'integer',
        'records_failed' => 'integer',
        'duration_ms' => 'integer',
    ];

    /**
     * Get the data source for this log
     */
    public function dataSource(): BelongsTo
    {
        return $this->belongsTo(ApiDataSource::class, 'api_data_source_id');
    }
}
