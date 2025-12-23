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
        // Migrate existing UPT-City relationships to pivot table
        $existingUpts = DB::table('mas_upts')
            ->whereNotNull('cities_code')
            ->where('cities_code', '!=', '')
            ->get(['code', 'cities_code']);

        foreach ($existingUpts as $upt) {
            DB::table('mas_city_upt')->insert([
                'upt_code' => $upt->code,
                'city_code' => $upt->cities_code,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Drop foreign key and column from mas_upts table
        Schema::table('mas_upts', function (Blueprint $table) {
            $table->dropForeign('fk_upt_city_code');
            $table->dropIndex('fk_upt_city_code');
            $table->dropColumn('cities_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore cities_code column
        Schema::table('mas_upts', function (Blueprint $table) {
            $table->string('cities_code', 100)->nullable()->after('river_basin_code');
            $table->index('cities_code', 'fk_upt_city_code');
            $table->foreign('cities_code', 'fk_upt_city_code')
                  ->references('code')
                  ->on('mas_cities')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
        });

        // Migrate data back from pivot table (take first city only)
        $pivotData = DB::table('mas_city_upt')
            ->select('upt_code', DB::raw('MIN(city_code) as city_code'))
            ->groupBy('upt_code')
            ->get();

        foreach ($pivotData as $data) {
            DB::table('mas_upts')
                ->where('code', $data->upt_code)
                ->update(['cities_code' => $data->city_code]);
        }

        // Drop pivot table
        Schema::dropIfExists('mas_city_upt');
    }
};
