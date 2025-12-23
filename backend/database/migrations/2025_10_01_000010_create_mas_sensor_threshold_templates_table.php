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
        Schema::create('mas_sensor_threshold_templates', function (Blueprint $table) {
            $table->id();
            $table->string('code', 100)->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('parameter_type', ['water_level', 'rainfall', 'discharge', 'temperature', 'other'])->default('water_level');
            $table->string('unit', 50)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Indexes
            $table->index('parameter_type', 'idx_threshold_template_parameter');
            $table->index('is_active', 'idx_threshold_template_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_sensor_threshold_templates');
    }
};

