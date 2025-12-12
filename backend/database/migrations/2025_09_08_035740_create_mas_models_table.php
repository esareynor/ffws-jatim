<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mas_models', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 100)->unique();
            $table->string('type', 100);
            $table->string('version', 50)->nullable();
            $table->text('description')->nullable();
            $table->string('file_path', 512)->nullable();
            $table->unsignedTinyInteger('n_steps_in')->nullable();
            $table->unsignedTinyInteger('n_steps_out')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes
            $table->index('type', 'idx_models_type');
            $table->index('is_active', 'idx_models_active');
        });
        
        // Check constraint (must be added after table creation)
        DB::statement('ALTER TABLE mas_models ADD CONSTRAINT chk_models_steps CHECK (n_steps_in > 0 AND n_steps_out > 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_models');
    }
};
