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
        Schema::create('mas_sensors', function (Blueprint $table) {
            $table->id();
            $table->string('mas_device_code', 100);
            $table->string('code', 100)->unique();
            $table->enum('parameter', ['water_level', 'rainfall']);
            $table->string('unit', 50);
            $table->string('description')->nullable();
            $table->foreignId('mas_model_id')->nullable()->constrained('mas_models')->onUpdate('restrict')->onDelete('set null');
            $table->double('threshold_safe')->nullable();
            $table->double('threshold_warning')->nullable();
            $table->double('threshold_danger')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->dateTime('last_seen')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('parameter', 'idx_sensors_parameter');
            $table->index('status', 'idx_sensors_status');
            $table->index('mas_device_code', 'idx_sensors_device_code');

            // Foreign key
            $table->foreign('mas_device_code', 'fk_sensors_device_code')
                ->references('code')
                ->on('mas_devices')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_sensors');
    }
};
