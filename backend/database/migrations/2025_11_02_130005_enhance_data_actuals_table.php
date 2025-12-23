<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration adds missing features to data_actuals table:
     * 1. Generated received_date column for date-based queries
     * 2. Additional composite indexes for performance optimization
     */
    public function up(): void
    {
        Schema::table('data_actuals', function (Blueprint $table) {
            // Add generated column for received_date
            // Note: Laravel doesn't support GENERATED columns natively, so we use raw SQL
        });

        // Add generated column using raw SQL
        DB::statement('ALTER TABLE data_actuals ADD COLUMN received_date DATE GENERATED ALWAYS AS (DATE(received_at)) STORED AFTER threshold_status');

        // Add additional indexes for optimization
        Schema::table('data_actuals', function (Blueprint $table) {
            $table->index('received_date', 'idx_da_date');
            $table->index(['mas_sensor_code', 'received_date'], 'idx_da_sensor_date');
            $table->index(['mas_sensor_code', 'threshold_status', 'received_at'], 'idx_da_sensor_status_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_actuals', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex('idx_da_date');
            $table->dropIndex('idx_da_sensor_date');
            $table->dropIndex('idx_da_sensor_status_date');
        });

        // Drop generated column using raw SQL
        DB::statement('ALTER TABLE data_actuals DROP COLUMN received_date');
    }
};

