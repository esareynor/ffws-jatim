<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasScaler extends Model
{
    use HasFactory;

    protected $table = 'mas_scalers';

    protected $fillable = [
        'mas_model_code',
        'mas_sensor_code',
        'name',
        'code',
        'io_axis',
        'technique',
        'version',
        'file_path',
        'file_hash_sha256',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the model associated with this scaler
     */
    public function model()
    {
        return $this->belongsTo(MasModel::class, 'mas_model_code', 'code');
    }

    /**
     * Get the sensor associated with this scaler
     */
    public function sensor()
    {
        return $this->belongsTo(MasSensor::class, 'mas_sensor_code', 'code');
    }

    /**
     * Scope for active scalers
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for specific technique
     */
    public function scopeTechnique($query, $technique)
    {
        return $query->where('technique', $technique);
    }

    /**
     * Scope for specific IO axis
     */
    public function scopeAxis($query, $axis)
    {
        return $query->where('io_axis', $axis);
    }

    /**
     * Get technique label
     */
    public function getTechniqueLabelAttribute()
    {
        return match($this->technique) {
            'standard' => 'Standard Scaler',
            'minmax' => 'MinMax Scaler',
            'robust' => 'Robust Scaler',
            'custom' => 'Custom Scaler',
            default => ucfirst($this->technique),
        };
    }

    /**
     * Get axis label
     */
    public function getAxisLabelAttribute()
    {
        return match($this->io_axis) {
            'x' => 'Input (X)',
            'y' => 'Output (Y)',
            default => strtoupper($this->io_axis),
        };
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute()
    {
        return $this->is_active ? 'success' : 'secondary';
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute()
    {
        return $this->is_active ? 'Active' : 'Inactive';
    }

    /**
     * Check if file exists
     */
    public function fileExists()
    {
        return file_exists(storage_path('app/' . $this->file_path));
    }

    /**
     * Get file size in human readable format
     */
    public function getFileSizeAttribute()
    {
        if (!$this->fileExists()) {
            return 'N/A';
        }

        $bytes = filesize(storage_path('app/' . $this->file_path));
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
