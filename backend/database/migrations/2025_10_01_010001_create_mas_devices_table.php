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
        Schema::create('mas_devices', function (Blueprint $table) {
            $table->id();
            $table->string('mas_river_basin_code', 100);
            $table->string('name');
            $table->string('code', 100)->unique();
            $table->double('latitude');
            $table->double('longitude');
            $table->double('elevation_m')->nullable();
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
            $table->timestamps();

            // Indexes
            $table->index('status', 'idx_devices_status');
            $table->index('mas_river_basin_code', 'idx_devices_basin_code');

            // Foreign key
            $table->foreign('mas_river_basin_code', 'fk_devices_basin_code')
                ->references('code')
                ->on('mas_river_basins')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_devices');
    }
};
