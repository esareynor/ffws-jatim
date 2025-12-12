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
        Schema::create('geojson_mapping', function (Blueprint $table) {
            $table->id();
            $table->string('geojson_code', 100)->unique();
            $table->string('mas_device_code', 100)->nullable();
            $table->string('mas_river_basin_code', 100)->nullable();
            $table->string('mas_watershed_code', 100)->nullable();
            $table->string('mas_city_code', 100)->nullable();
            $table->string('mas_regency_code', 100)->nullable();
            $table->string('mas_village_code', 100)->nullable();
            $table->string('mas_upt_code', 100)->nullable();
            $table->string('mas_uptd_code', 100)->nullable();
            $table->string('mas_device_parameter_code', 100)->nullable();
            $table->string('code', 100)->nullable();
            $table->decimal('value_min', 12, 4)->nullable();
            $table->decimal('value_max', 12, 4)->nullable();
            $table->string('file_path', 512)->nullable();
            $table->string('version', 50)->nullable();
            $table->text('description')->nullable();
            $table->text('properties_content')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('mas_device_code', 'idx_gm_device');
            $table->index('mas_river_basin_code', 'idx_gm_rbasin');
            $table->index('mas_watershed_code', 'idx_gm_watershed');
            $table->index('mas_city_code', 'idx_gm_city');
            $table->index('mas_regency_code', 'idx_gm_regency');
            $table->index('mas_village_code', 'idx_gm_village');
            $table->index('mas_upt_code', 'idx_gm_upt');
            $table->index('mas_uptd_code', 'idx_gm_uptd');
            $table->index('mas_device_parameter_code', 'idx_gm_device_param');

            // Foreign keys (only for existing tables)
            $table->foreign('mas_device_code', 'fk_gm_device_code')
                ->references('code')
                ->on('mas_devices')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->foreign('mas_river_basin_code', 'fk_gm_rbasin_code')
                ->references('code')
                ->on('mas_river_basins')
                ->onDelete('set null')
                ->onUpdate('cascade');

            // Note: Other foreign keys will be added by a separate migration
            // after the referenced tables are created
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geojson_mapping');
    }
};
