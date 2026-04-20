<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\ExamCardController;
use App\Http\Controllers\LagacyNinController;
use App\Http\Controllers\SettingsController;
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
    // Route::get('/nin-service', function () {
    //     return Inertia::render('NinService');
    // })->name('nin.service');
    
    // Exam Card routes
    Route::get('/exam-cards', function () {
        return Inertia::render('ExamCards');
    })->name('exam.cards');
    
    // Lagacy NIN Service Routes
    Route::get('/lagacy-nin', function () {
        return inertia('LagacyNin');
    })->name('lagacy-nin');
    
    // Admin routes
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/admin', function () {
            return Inertia::render('Admin/Admin');
        })->name('admin.dashboard');
        
        Route::get('/admin/stats', [App\Http\Controllers\AdminController::class, 'getStats'])->name('admin.stats');
        Route::get('/admin/users', [App\Http\Controllers\AdminController::class, 'getUsers'])->name('admin.users');
        Route::get('/admin/nin-requests', [App\Http\Controllers\AdminController::class, 'getNinRequests'])->name('admin.nin.requests');
        Route::get('/admin/system-logs', [App\Http\Controllers\AdminController::class, 'getSystemLogs'])->name('admin.system.logs');
        Route::get('/admin/settings', [App\Http\Controllers\AdminController::class, 'getSettings'])->name('admin.settings');
    });
    
    // Bug report routes
    Route::get('/report-bug', [App\Http\Controllers\ReportController::class, 'index'])->name('report.bug');
    Route::post('/report-bug', [App\Http\Controllers\ReportController::class, 'submit'])->name('report.bug.submit');
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/admin/reports', [App\Http\Controllers\ReportController::class, 'allReports'])->name('admin.reports');
    });
    
    // History routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/history', [App\Http\Controllers\HistoryController::class, 'index'])->name('history');
        Route::get('/api/user/history', [App\Http\Controllers\HistoryController::class, 'getUserHistory'])->name('user.history');
        Route::post('/api/cache/clear', [App\Http\Controllers\HistoryController::class, 'clearCache'])->name('cache.clear');
    });
    
    // Keep session alive endpoint
    Route::post('/api/lagacy-nin/keep-alive', [LagacyNinController::class, 'keepAlive']);
    
    // V1 API
    Route::post('/api/lagacy-nin/search', [LagacyNinController::class, 'LagacyNin']);
    
    // V2 API
    Route::post('/api/lagacy-nin/v2/search', [LagacyNinController::class, 'LagacyNinV2']);
    
    // V3 API
    Route::post('/api/lagacy-nin/v3/search', [LagacyNinController::class, 'LagacyNinV3']);
    
    // V4 API
    Route::post('/api/lagacy-nin/v4/search', [LagacyNinController::class, 'LagacyNinV4']);
    
    // PDF Generation
    Route::post('/api/lagacy-nin/pdf', [LagacyNinController::class, 'generatePDF']);


    // settings and the rest
    Route::get('settings', [SettingsController::class, 'settings'])->name('settings');
    
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

});

require __DIR__.'/auth.php';