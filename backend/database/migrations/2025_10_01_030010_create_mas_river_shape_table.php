<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * NOTE: Stores river shape geometry data for geospatial visualization
     */
    public function up(): void
    {
        Schema::create('mas_river_shape', function (Blueprint $table) {
            $table->id();
            $table->string('code', 100)->nullable();
            $table->string('sensor_code', 100)->nullable();
            $table->json('array_codes')->nullable();
            $table->decimal('x', 15, 6)->nullable();
            $table->decimal('y', 15, 6)->nullable();
            $table->decimal('a', 15, 6)->nullable();
            $table->decimal('b', 15, 6)->nullable();
            $table->decimal('c', 15, 6)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            // Indexes
            $table->index('code', 'idx_river_shape_code');
            $table->index('sensor_code', 'idx_river_shape_sensor');

            // Foreign key
            $table->foreign('sensor_code', 'fk_river_shape_sensor')
                ->references('code')
                ->on('mas_sensors')
                ->onDelete('set null')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_river_shape');
    }
};

