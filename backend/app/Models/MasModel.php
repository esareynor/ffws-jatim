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
     * Get the sensors that use this model.
     */
    public function sensors(): HasMany
    {
        return $this->hasMany(MasSensor::class, 'mas_model_id');
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
