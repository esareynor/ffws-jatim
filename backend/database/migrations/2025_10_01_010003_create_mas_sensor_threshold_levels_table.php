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
        Schema::create('mas_sensor_threshold_levels', function (Blueprint $table) {
            $table->id();
            $table->string('threshold_template_code', 100);
            $table->integer('level_order');
            $table->string('level_name', 100);
            $table->string('level_code', 100)->unique();
            $table->decimal('min_value', 12, 4)->nullable();
            $table->decimal('max_value', 12, 4)->nullable();
            $table->string('color', 20)->nullable();
            $table->string('color_hex', 7)->nullable();
            $table->enum('severity', ['normal', 'watch', 'warning', 'danger', 'critical'])->default('normal');
            $table->boolean('alert_enabled')->default(false);
            $table->text('alert_message')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('threshold_template_code', 'idx_threshold_level_template');
            $table->index('level_order', 'idx_threshold_level_order');
            $table->index('severity', 'idx_threshold_level_severity');

            // Foreign key
            $table->foreign('threshold_template_code', 'fk_threshold_level_template')
                ->references('code')
                ->on('mas_sensor_threshold_templates')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mas_sensor_threshold_levels');
    }
};

