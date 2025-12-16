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
        Schema::create('mas_river_basins', function (Blueprint $table) {
            $table->id(); // bigint, not null, auto_increment, primary
            $table->string('name');
            $table->string('code', 100)->unique();
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_river_basins');
    }
};
