<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\DataActual;
use App\Models\DataPrediction;
use App\Observers\DataActualObserver;
use App\Observers\DataPredictionObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register observers for automatic discharge calculation
        DataActual::observe(DataActualObserver::class);
        DataPrediction::observe(DataPredictionObserver::class);
    }
}
