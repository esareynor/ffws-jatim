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
        Schema::create('mas_provinces', function (Blueprint $table) {
            $table->id();
            $table->string('provinces_name');
            $table->string('provinces_code', 100)->unique();
            $table->timestamps();

            // Indexes
            $table->index('provinces_name', 'idx_provinces_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_provinces');
    }
};

