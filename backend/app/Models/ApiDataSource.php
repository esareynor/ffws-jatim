<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApiDataSource extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'api_url',
        'api_method',
        'api_headers',
        'api_params',
        'api_body',
        'auth_type',
        'auth_credentials',
        'response_format',
        'data_mapping',
        'fetch_interval_minutes',
        'last_fetch_at',
        'last_success_at',
        'last_error',
        'consecutive_failures',
        'is_active',
        'description',
    ];

    protected $casts = [
        'api_headers' => 'array',
        'api_params' => 'array',
        'api_body' => 'array',
        'data_mapping' => 'array',
        'last_fetch_at' => 'datetime',
        'last_success_at' => 'datetime',
        'is_active' => 'boolean',
        'consecutive_failures' => 'integer',
        'fetch_interval_minutes' => 'integer',
    ];

    protected $hidden = [
        'auth_credentials',
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'code';
    }

    /**
     * Get fetch logs for this data source
     */
    public function fetchLogs(): HasMany
    {
        return $this->hasMany(ApiDataFetchLog::class);
    }

    /**
     * Get sensor mappings for this data source
     */
    public function sensorMappings(): HasMany
    {
        return $this->hasMany(SensorApiMapping::class);
    }

    /**
     * Check if it's time to fetch data
     */
    public function shouldFetch(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->last_fetch_at === null) {
            return true;
        }

        $intervalMinutes = $this->fetch_interval_minutes ?? 15;
        $nextFetchTime = $this->last_fetch_at->addMinutes($intervalMinutes);

        return now()->gte($nextFetchTime);
    }

    /**
     * Get decrypted auth credentials
     */
    public function getDecryptedCredentials(): ?array
    {
        if (empty($this->auth_credentials)) {
            return null;
        }

        try {
            return json_decode(decrypt($this->auth_credentials), true);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Set encrypted auth credentials
     */
    public function setAuthCredentialsAttribute($value)
    {
        if (is_array($value)) {
            $value = json_encode($value);
        }

        $this->attributes['auth_credentials'] = !empty($value) ? encrypt($value) : null;
    }
}
