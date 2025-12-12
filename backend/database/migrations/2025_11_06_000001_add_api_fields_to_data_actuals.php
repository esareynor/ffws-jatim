<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add fields needed for API data fetch system
     */
    public function up(): void
    {
        Schema::table('data_actuals', function (Blueprint $table) {
            // Add device code reference
            $table->string('mas_device_code')->nullable()->after('mas_sensor_code');

            // Add status from API
            $table->string('status')->nullable()->after('threshold_status');

            // Add source tracking
            $table->string('source')->default('manual')->after('status'); // manual, api_fetch, mqtt, etc

            // Add API fetch timestamp
            $table->timestamp('fetched_at')->nullable()->after('source');

            // Add indexes
            $table->index('mas_device_code');
            $table->index('source');
            $table->index(['mas_sensor_code', 'received_at'], 'idx_sensor_received');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_actuals', function (Blueprint $table) {
            $table->dropIndex('idx_sensor_received');
            $table->dropIndex(['source']);
            $table->dropIndex(['mas_device_code']);

            $table->dropColumn(['mas_device_code', 'status', 'source', 'fetched_at']);
        });
    }
};
