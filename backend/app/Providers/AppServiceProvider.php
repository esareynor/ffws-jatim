<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
<<<<<<< HEAD
use Illuminate\Support\Facades\URL; // Import Facade URL
=======
use App\Models\DataActual;
use App\Models\DataPrediction;
use App\Observers\DataActualObserver;
use App\Observers\DataPredictionObserver;
>>>>>>> 09a1e02819fdd28f6f8d6c3b850b120d0dee2b67

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
        // Force HTTPS because we are behind Nginx Proxy Manager
        if ($this->app->environment('production') || true) { // Force on 'true' just to be safe for now
            URL::forceScheme('https');
        }

        Vite::prefetch(concurrency: 3);

        // Register observers for automatic discharge calculation
        DataActual::observe(DataActualObserver::class);
        DataPrediction::observe(DataPredictionObserver::class);
    }
}
