<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('test', [\App\Http\Controllers\TestController::class, 'test'])->name('test');
Route::get('init', [\App\Http\Controllers\InitController::class, 'init'])->name('init');
