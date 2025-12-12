<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserByRole extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_by_role';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'phone_number',
        'upt_code',
        'role',
        'status',
        'bio',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the UPT that this user role belongs to.
     */
    public function upt()
    {
        return $this->belongsTo(MasUpt::class, 'upt_code', 'code');
    }

    /**
     * Scope a query to only include users with a specific role.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $role
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope a query to only include active users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include users by UPT.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $uptCode
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByUpt($query, $uptCode)
    {
        return $query->where('upt_code', $uptCode);
    }

    /**
     * Check if the user role is active.
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Check if the user role is an admin.
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Check if the user role is a moderator.
     *
     * @return bool
     */
    public function isModerator()
    {
        return $this->role === 'moderator';
    }
}

