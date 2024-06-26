<?php

use App\Http\Controllers\SessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::post('/assistant/message', [\App\Http\Controllers\Api\AssistantController::class, 'message']);
Route::get('/session', [SessionController::class, 'generateSession']);
