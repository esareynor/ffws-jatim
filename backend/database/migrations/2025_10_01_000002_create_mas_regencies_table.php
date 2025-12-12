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
        Schema::create('mas_regencies', function (Blueprint $table) {
            $table->id();
            $table->string('regencies_name');
            $table->string('regencies_code', 100)->unique();
            $table->timestamps();

            // Indexes
            $table->index('regencies_name', 'idx_regencies_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_regencies');
    }
};

