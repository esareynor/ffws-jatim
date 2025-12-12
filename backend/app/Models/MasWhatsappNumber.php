<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasWhatsappNumber extends Model
{
    use HasFactory;

    protected $table = 'mas_whatsapp_numbers';

    protected $fillable = [
        'name',
        'number',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope for active numbers
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get formatted phone number
     */
    public function getFormattedNumberAttribute()
    {
        // Format: +62 812-3456-7890
        $number = $this->number;
        
        if (substr($number, 0, 2) === '62') {
            $number = '+' . $number;
        } elseif (substr($number, 0, 1) === '0') {
            $number = '+62' . substr($number, 1);
        }
        
        return $number;
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
     * Validate Indonesian phone number format
     */
    public static function validateIndonesianNumber($number)
    {
        // Remove all non-numeric characters
        $cleaned = preg_replace('/[^0-9]/', '', $number);
        
        // Check if starts with 62 (country code) or 0
        if (substr($cleaned, 0, 2) === '62') {
            return strlen($cleaned) >= 11 && strlen($cleaned) <= 15;
        } elseif (substr($cleaned, 0, 1) === '0') {
            return strlen($cleaned) >= 10 && strlen($cleaned) <= 14;
        }
        
        return false;
    }

    /**
     * Normalize phone number to international format
     */
    public static function normalizeNumber($number)
    {
        // Remove all non-numeric characters
        $cleaned = preg_replace('/[^0-9]/', '', $number);
        
        // Convert to 62 format
        if (substr($cleaned, 0, 1) === '0') {
            return '62' . substr($cleaned, 1);
        } elseif (substr($cleaned, 0, 2) !== '62') {
            return '62' . $cleaned;
        }
        
        return $cleaned;
    }
}
