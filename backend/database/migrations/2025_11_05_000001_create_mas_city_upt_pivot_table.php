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
        // Create pivot table for many-to-many relationship between UPT and Cities
        Schema::create('mas_city_upt', function (Blueprint $table) {
            $table->id();
            $table->string('upt_code', 100);
            $table->string('city_code', 100);
            $table->timestamps();

            // Composite unique to prevent duplicate assignments
            $table->unique(['upt_code', 'city_code'], 'unique_upt_city');

            // Indexes for faster lookups
            $table->index('upt_code', 'idx_pivot_upt_code');
            $table->index('city_code', 'idx_pivot_city_code');

            // Foreign keys
            $table->foreign('upt_code', 'fk_pivot_upt_code')
                  ->references('code')
                  ->on('mas_upts')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->foreign('city_code', 'fk_pivot_city_code')
                  ->references('code')
                  ->on('mas_cities')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_city_upt');
    }
};
