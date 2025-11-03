<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasRegency extends Model
{
    use HasFactory;

    protected $table = 'mas_regencies';

    protected $fillable = [
        'regencies_name',
        'regencies_code',
    ];
}

