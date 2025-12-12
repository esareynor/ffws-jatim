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
        Schema::table('mas_uptds', function (Blueprint $table) {
            // Add city_code field after upt_code
            $table->string('city_code', 100)->after('upt_code');

            // Add index
            $table->index('city_code', 'idx_uptd_city_code');

            // Add foreign key
            $table->foreign('city_code', 'fk_uptd_city_code')
                  ->references('code')
                  ->on('mas_cities')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mas_uptds', function (Blueprint $table) {
            // Drop foreign key and index first
            $table->dropForeign('fk_uptd_city_code');
            $table->dropIndex('idx_uptd_city_code');

            // Drop column
            $table->dropColumn('city_code');
        });
    }
};
