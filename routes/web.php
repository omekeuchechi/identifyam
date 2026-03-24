<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\ExamCardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Wallet routes
    Route::get('/funding', function () {
        return Inertia::render('Funding');
    })->name('funding');
    
    Route::post('/wallet/funding/initialize', [WalletController::class, 'initializeFunding'])->name('wallet.funding.initialize');
    Route::get('/wallet/funding/callback', [WalletController::class, 'fundingCallback'])->name('wallet.funding.callback');
    Route::post('/wallet/transfer', [WalletController::class, 'transfer'])->name('wallet.transfer');
    Route::get('/wallet/balance', [WalletController::class, 'balance'])->name('wallet.balance');
    Route::get('/wallet/transactions', [WalletController::class, 'transactions'])->name('wallet.transactions');
    
    // NIN Service routes
    Route::get('/nin-service', function () {
        return Inertia::render('NinService');
    })->name('nin.service');
    
    // Exam Card routes
    Route::get('/exam-cards', function () {
        return Inertia::render('ExamCards');
    })->name('exam.cards');
    
    // Exam Card API routes (authenticated)
    Route::prefix('api/exam-cards')->group(function () {
        // Get available cards from external API
        Route::get('/available', [ExamCardController::class, 'getAvailableCards'])->name('available');
        
        // Auth test endpoint
        Route::get('/auth-test', function () {
            return response()->json([
                'user_authenticated' => \Illuminate\Support\Facades\Auth::check(),
                'user_id' => \Illuminate\Support\Facades\Auth::id(),
                'user_name' => \Illuminate\Support\Facades\Auth::user() ? \Illuminate\Support\Facades\Auth::user()->name : 'not_logged_in',
                'session_id' => \Illuminate\Support\Facades\Session::getId(),
                'guard_used' => \Illuminate\Support\Facades\Auth::getDefaultDriver()
            ]);
        })->name('auth-test');
        
        // Purchase cards
        Route::post('/purchase', [ExamCardController::class, 'purchaseCards'])->name('purchase');
        
        // Get user's purchase history
        Route::get('/purchases', [ExamCardController::class, 'getUserPurchases'])->name('purchases');
        
        // Download PDF
        Route::get('/download/{reference}', [ExamCardController::class, 'downloadPDF'])->name('download');
    });

    // Lagacy NIN Service Routes
    Route::get('/lagacy-nin', function () {
        return inertia('LagacyNin');
    })->name('lagacy-nin');
    
    // V1 API
    Route::post('/api/lagacy-nin/search', [App\Http\Controllers\LagacyNinController::class, 'LagacyNin']);
    
    // V2 API
    Route::post('/api/lagacy-nin/v2/search', [App\Http\Controllers\LagacyNinController::class, 'LagacyNinV2']);
    
    // V3 API
    Route::post('/api/lagacy-nin/v3/search', [App\Http\Controllers\LagacyNinController::class, 'LagacyNinV3']);
    
    // V4 API
    Route::post('/api/lagacy-nin/v4/search', [App\Http\Controllers\LagacyNinController::class, 'LagacyNinV4']);
    
    // PDF Generation
    Route::post('/api/lagacy-nin/pdf', [App\Http\Controllers\LagacyNinController::class, 'generatePDF']);

});

require __DIR__.'/auth.php';
