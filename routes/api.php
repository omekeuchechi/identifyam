<?php

use App\Http\Controllers\Nin\NinController;
use App\Http\Controllers\ExamCardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// NIN Service API Routes
Route::prefix('nin')->group(function () {
    // Search API 1
    Route::post('/search1', [NinController::class, 'nin_search1']);
    Route::post('/search-by-phone1', [NinController::class, 'search_by_Phone1']);
    
    // Search API 2
    Route::post('/search2', [NinController::class, 'nin_search2']);
    Route::post('/search-by-phone2', [NinController::class, 'search_by_Phone2']);
    
    // Search API 3
    Route::post('/search3', [NinController::class, 'nin_search3']);
    Route::post('/search-by-phone3', [NinController::class, 'search_by_Phone3']);
    
    // Search API 4
    Route::post('/search4', [NinController::class, 'nin_search4']);
    Route::post('/search-by-phone4', [NinController::class, 'search_by_Phone4']);
    
    // Demographic Search
    Route::post('/search-demographic', [NinController::class, 'nin_search_demographic']);
});

// Exam Card API Routes
Route::prefix('exam-cards')->group(function () {
    // Test endpoint (no auth required)
    Route::get('/test', function () {
        return response()->json([
            'message' => 'Exam cards API is working',
            'timestamp' => now(),
            'status' => 'success'
        ]);
    })->name('test');
    
    // Get available cards from external API (public)
    Route::get('/available', [ExamCardController::class, 'getAvailableCards'])->name('available');
    
    // Get locally stored cards (public)
    Route::get('/local', [ExamCardController::class, 'getLocalCards'])->name('local');
});
