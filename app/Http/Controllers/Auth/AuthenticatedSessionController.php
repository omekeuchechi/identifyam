<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Flash auth activity so the front-end can detect login
        $user = Auth::user();
        $request->session()->flash('auth_activity', [
            'type' => 'LOGIN',
            'userId' => $user->id,
            'userEmail' => $user->email,
            'userName' => $user->name,
            'timestamp' => now()->toISOString(),
        ]);

        if (Auth::check() && Auth::user()->isAdmin) {
            return redirect()->intended(route('admin.dashboard', absolute: false));    
        } else {
            return redirect()->intended(route('dashboard', absolute: false));
        }

    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // Store logout activity in a cookie so the login page JS can detect it
        // (session is destroyed above, so we use a temporary cookie)
        $cookie = cookie('auth_activity', json_encode([
            'type' => 'LOGOUT',
            'userId' => $user?->id,
            'userEmail' => $user?->email,
            'userName' => $user?->name,
            'timestamp' => now()->toISOString(),
        ]), 1); // expires in 1 minute

        return redirect('/')->withCookie($cookie);
    }
}
