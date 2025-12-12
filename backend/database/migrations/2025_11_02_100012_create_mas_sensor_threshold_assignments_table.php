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
        Schema::create('mas_sensor_threshold_assignments', function (Blueprint $table) {
            $table->id();
            $table->string('mas_sensor_code', 100);
            $table->string('threshold_template_code', 100);
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('mas_sensor_code', 'idx_sensor_threshold_sensor');
            $table->index('threshold_template_code', 'idx_sensor_threshold_template');
            $table->index(['effective_from', 'effective_to'], 'idx_sensor_threshold_dates');
            $table->index('is_active', 'idx_sensor_threshold_active');

            // Foreign keys
            $table->foreign('mas_sensor_code', 'fk_sensor_threshold_sensor')
                ->references('code')
                ->on('mas_sensors')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('threshold_template_code', 'fk_sensor_threshold_template_assign')
                ->references('code')
                ->on('mas_sensor_threshold_templates')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_sensor_threshold_assignments');
    }
};

