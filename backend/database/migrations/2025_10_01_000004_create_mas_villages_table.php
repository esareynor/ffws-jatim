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
        Schema::create('mas_villages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 100)->unique();
            $table->timestamps();

            // Indexes
            $table->index('name', 'idx_villages_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_villages');
    }
};

