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
        Schema::create('calculated_discharges', function (Blueprint $table) {
            $table->id();
            $table->string('mas_sensor_code', 100);
            $table->decimal('sensor_value', 12, 4);
            $table->decimal('sensor_discharge', 15, 4);
            $table->string('rating_curve_code', 100);
            $table->dateTime('calculated_at');
            $table->timestamps();

            // Indexes
            $table->unique(['mas_sensor_code', 'calculated_at'], 'uq_cd_sensor_ts');
            $table->index('calculated_at', 'idx_cd_calculated_at');
            $table->index(['mas_sensor_code', 'calculated_at'], 'idx_cd_sensor_calc');
            $table->index('rating_curve_code', 'idx_cd_curve');

            // Foreign keys
            $table->foreign('mas_sensor_code', 'fk_cd_sensor_code')
                ->references('code')
                ->on('mas_sensors')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('rating_curve_code', 'fk_cd_curve_code')
                ->references('code')
                ->on('rating_curves')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calculated_discharges');
    }
};
