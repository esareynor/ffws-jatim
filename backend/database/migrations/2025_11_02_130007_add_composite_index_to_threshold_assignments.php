<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration adds a composite index for optimized active threshold lookups.
     * This index improves performance when querying for active threshold assignments
     * for a specific sensor within a date range.
     */
    public function up(): void
    {
        Schema::table('mas_sensor_threshold_assignments', function (Blueprint $table) {
            $table->index(
                ['mas_sensor_code', 'is_active', 'effective_from', 'effective_to'],
                'idx_sensor_threshold_active_lookup'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mas_sensor_threshold_assignments', function (Blueprint $table) {
            $table->dropIndex('idx_sensor_threshold_active_lookup');
        });
    }
};

