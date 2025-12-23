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
        Schema::create('mas_scalers', function (Blueprint $table) {
            $table->id();
            $table->string('mas_model_code', 100)->nullable();
            $table->string('mas_sensor_code', 100)->nullable();
            $table->string('name');
            $table->string('code', 100)->unique();
            $table->enum('io_axis', ['x', 'y']);
            $table->enum('technique', ['standard', 'minmax', 'robust', 'custom'])->default('custom');
            $table->string('version', 64)->nullable();
            $table->string('file_path', 512);
            $table->char('file_hash_sha256', 64)->nullable();
            $table->boolean('is_active')->default(1);
            $table->timestamps();

            // Indexes
            $table->unique(['mas_model_code', 'mas_sensor_code', 'io_axis', 'is_active'], 'uk_model_sensor_axis_active');
            $table->index('is_active', 'idx_scalers_active');
            $table->index('mas_sensor_code', 'idx_scalers_sensor_code');
            $table->index('mas_model_code', 'idx_scalers_model_code');

            // Foreign keys
            $table->foreign('mas_model_code', 'fk_scaler_model_code')
                ->references('code')
                ->on('mas_models')
                ->onDelete('restrict')
                ->onUpdate('cascade');

            $table->foreign('mas_sensor_code', 'fk_scaler_sensor_code')
                ->references('code')
                ->on('mas_sensors')
                ->onDelete('set null')
                ->onUpdate('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_scalers');
    }
};
