<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'type',
        'version',
        'description',
        'file_path',
        'n_steps_in',
        'n_steps_out',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'n_steps_in' => 'integer',
        'n_steps_out' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate code when creating a new model
        static::creating(function ($model) {
            if (empty($model->code)) {
                $model->code = static::generateUniqueCode($model);
            }
        });
    }

    /**
     * Generate a unique code for the model.
     */
    protected static function generateUniqueCode($model)
    {
        $prefix = strtoupper($model->type ?? 'MODEL');
        $timestamp = now()->format('YmdHis');
        $random = strtoupper(substr(md5(uniqid()), 0, 4));
        
        $code = "{$prefix}_{$timestamp}_{$random}";
        
        // Ensure uniqueness
        $counter = 1;
        $originalCode = $code;
        while (static::where('code', $code)->exists()) {
            $code = "{$originalCode}_{$counter}";
            $counter++;
        }
        
        return $code;
    }

    /**
     * Get the sensors that use this model.
     */
    public function sensors(): HasMany
    {
        return $this->hasMany(MasSensor::class, 'mas_model_code', 'code');
    }

    /**
     * Scope a query to only include active models.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the model name attribute.
     */
    public function getModelNameAttribute()
    {
        return $this->name;
    }

    /**
     * Get the manufacturer attribute (assuming it's part of the name or description).
     */
    public function getManufacturerAttribute()
    {
        // This is a placeholder - you might want to add a manufacturer field to the table
        return 'Unknown';
    }
}
