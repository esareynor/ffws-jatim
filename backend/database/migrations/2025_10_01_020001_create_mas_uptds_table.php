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
        Schema::create('mas_uptds', function (Blueprint $table) {
            $table->id();
            $table->string('upt_code', 100);
            $table->string('name');
            $table->string('code', 100)->unique();
            $table->timestamps();

            // Indexes
            $table->index('name', 'idx_uptd_name');
            $table->index('upt_code', 'fk_uptd_upt_code');

            // Foreign keys
            $table->foreign('upt_code', 'fk_uptd_upt_code')
                  ->references('code')
                  ->on('mas_upts')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_uptds');
    }
};

