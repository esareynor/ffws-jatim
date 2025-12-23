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
        Schema::create('rating_curves', function (Blueprint $table) {
            $table->id();
            $table->string('mas_sensor_code', 100);
            $table->string('code', 100)->unique();
            // Updated formula types: added tipe-01, tipe-02, tipe-03 for new UI mockup
            // Legacy types (power, polynomial, exponential, custom) still supported for backward compatibility
            $table->enum('formula_type', ['tipe-01', 'tipe-02', 'tipe-03', 'power', 'polynomial', 'exponential', 'custom'])->default('tipe-01');
            $table->decimal('a', 15, 6)->nullable()->comment('Offset parameter (not used in tipe-02)');
            $table->decimal('b', 15, 6)->comment('Exponent or width coefficient parameter');
            $table->decimal('c', 15, 6)->comment('Main coefficient parameter');
            $table->date('effective_date');
            $table->timestamps();

            // Indexes
            $table->index(['mas_sensor_code', 'effective_date'], 'idx_rc_sensor_date');
            $table->index('effective_date', 'idx_rc_effective_date');

            // Foreign key
            $table->foreign('mas_sensor_code', 'fk_rc_sensor_code')
                ->references('code')
                ->on('mas_sensors')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rating_curves');
    }
};
