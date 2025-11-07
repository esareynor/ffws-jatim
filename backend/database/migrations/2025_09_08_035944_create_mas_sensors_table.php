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
            $table->foreignId('device_id')->constrained('mas_devices')->onUpdate('restrict')->onDelete('cascade');
            $table->string('code', 100)->unique();
            $table->enum('parameter', ['water_level', 'rainfall']);
            $table->string('unit', 50);
            $table->string('description')->nullable();
            $table->foreignId('mas_model_id')->nullable()->constrained('mas_models')->onUpdate('restrict')->onDelete('set null');
            $table->double('threshold_safe')->nullable();
            $table->double('threshold_warning')->nullable();
            $table->double('threshold_danger')->nullable();
            $table->enum('status', ['active', 'inactive']);
            $table->dateTime('last_seen')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('parameter', 'idx_sensors_parameter');
            $table->index('status', 'idx_sensors_status');
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
