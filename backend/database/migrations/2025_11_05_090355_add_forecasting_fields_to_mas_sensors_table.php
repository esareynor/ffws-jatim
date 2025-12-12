<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mas_sensors', function (Blueprint $table) {
            // Add mas_model_code column (foreign key to mas_models)
            $table->string('mas_model_code', 100)->nullable()->after('mas_model_id');

            // Add forecasting_status column
            $table->enum('forecasting_status', ['active', 'paused', 'stopped', 'inactive'])
                  ->default('inactive')
                  ->after('status');

            // Add foreign key for mas_model_code
            $table->foreign('mas_model_code', 'fk_sensors_model_code')
                  ->references('code')
                  ->on('mas_models')
                  ->onUpdate('cascade')
                  ->onDelete('set null');

            // Add index for forecasting_status
            $table->index('forecasting_status', 'idx_sensors_forecasting_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mas_sensors', function (Blueprint $table) {
            // Drop foreign key and indexes first
            $table->dropForeign('fk_sensors_model_code');
            $table->dropIndex('idx_sensors_forecasting_status');

            // Drop columns
            $table->dropColumn(['mas_model_code', 'forecasting_status']);
        });
    }
};
