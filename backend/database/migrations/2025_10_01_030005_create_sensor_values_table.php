<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * NOTE: This table stores additional sensor metadata and display information
     * Differs from mas_sensors which stores core sensor configuration
     * Use this for UI/display purposes, mas_sensors for operational data
     */
    public function up(): void
    {
        Schema::create('sensor_values', function (Blueprint $table) {
            $table->id();
            $table->string('mas_sensor_code', 100);
            $table->string('mas_sensor_parameter_code', 100);
            $table->string('mas_sensor_threshold_code', 100)->nullable();
            $table->string('sensor_name')->nullable();
            $table->string('sensor_unit', 50)->nullable();
            $table->text('sensor_description')->nullable();
            $table->string('sensor_icon_path', 500)->nullable();
            $table->enum('status', ['active', 'inactive', 'fault'])->default('active');
            $table->dateTime('last_seen')->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();

            // Indexes
            $table->index('mas_sensor_code', 'idx_sv_sensor_code');
            $table->index('mas_sensor_parameter_code', 'idx_sv_param');
            $table->index('mas_sensor_threshold_code', 'idx_sv_threshold');
            $table->index(['status', 'is_active'], 'idx_sv_status');
            $table->index('last_seen', 'idx_sv_last_seen');

            // Foreign keys
            $table->foreign('mas_sensor_code', 'fk_sv_sensor_code')
                ->references('code')
                ->on('mas_sensors')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('mas_sensor_parameter_code', 'fk_sv_param_code')
                ->references('code')
                ->on('mas_sensor_parameters')
                ->onDelete('restrict')
                ->onUpdate('cascade');

            $table->foreign('mas_sensor_threshold_code', 'fk_sv_threshold_code')
                ->references('code')
                ->on('mas_sensor_threshold_templates')
                ->onDelete('set null')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_values');
    }
};

