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
        Schema::create('mas_watersheds', function (Blueprint $table) {
            $table->id();
            $table->string('river_basin_code', 100);
            $table->string('name');
            $table->string('code', 100)->unique();
            $table->timestamps();

            // Indexes
            $table->index('name', 'idx_ws_name');
            $table->index('river_basin_code', 'fk_ws_basin_code');

            // Foreign keys
            $table->foreign('river_basin_code', 'fk_ws_basin_code')
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
        Schema::dropIfExists('mas_watersheds');
    }
};

