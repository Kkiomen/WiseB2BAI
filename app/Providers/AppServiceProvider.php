<?php

namespace App\Providers;

use App\Core\Adapter\LLM\LanguageModel;
use App\Core\Adapter\LLM\models\OpenAi\OpenAiLanguageModel;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Language Model
        $this->app->bind(LanguageModel::class, OpenAiLanguageModel::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
