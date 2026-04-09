<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GoogleController extends Controller
{
    /**
     * Redirect to Google authentication page.
     */
    public function redirect(): \Symfony\Component\HttpFoundation\RedirectResponse
    {
        // Check if Google credentials are configured
        if (!config('services.google.client_id') || !config('services.google.client_secret')) {
            file_put_contents(storage_path('debug.log'), "ERROR: Google OAuth credentials not configured\n", FILE_APPEND);
            return redirect()->route('login')
                ->with('error', 'Google authentication not properly configured.');
        }

        $googleUrl = 'https://accounts.google.com/o/oauth2/auth?';
        $params = [
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => route('google.callback'),
            'response_type' => 'code',
            'scope' => 'email profile',
            'access_type' => 'offline',
            'prompt' => 'consent',
        ];

        file_put_contents(storage_path('debug.log'), "Redirecting to Google OAuth with URI: " . route('google.callback') . "\n", FILE_APPEND);
        return redirect($googleUrl . http_build_query($params));
    }

    /**
     * Handle Google callback.
     */
    public function callback(Request $request): \Illuminate\Http\RedirectResponse
    {
        try {
            // Simple debugging - write to a file
            file_put_contents(storage_path('debug.log'), "Google callback started at " . now() . "\n", FILE_APPEND);

            $token = $request->get('code');

            if (!$token) {
                file_put_contents(storage_path('debug.log'), "ERROR: No authorization code received\n", FILE_APPEND);
                return redirect()->route('login')
                    ->with('error', 'Google authentication failed: No authorization code received.');
            }

            file_put_contents(storage_path('debug.log'), "Authorization code received: " . substr($token, 0, 20) . "...\n", FILE_APPEND);

            // Check Google credentials
            $clientId = config('services.google.client_id');
            $clientSecret = config('services.google.client_secret');
            $redirectUri = route('google.callback');

            file_put_contents(storage_path('debug.log'), "Client ID: " . ($clientId ? 'SET' : 'NOT SET') . "\n", FILE_APPEND);
            file_put_contents(storage_path('debug.log'), "Client Secret: " . ($clientSecret ? 'SET' : 'NOT SET') . "\n", FILE_APPEND);
            file_put_contents(storage_path('debug.log'), "Redirect URI: " . $redirectUri . "\n", FILE_APPEND);

            if (!$clientId || !$clientSecret) {
                file_put_contents(storage_path('debug.log'), "ERROR: Google credentials not configured\n", FILE_APPEND);
                return redirect()->route('login')
                    ->with('error', 'Google authentication not properly configured.');
            }

            $response = \Illuminate\Support\Facades\Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => route('google.callback'),
                'grant_type' => 'authorization_code',
                'code' => $token,
            ]);

            $data = $response->json();
            file_put_contents(storage_path('debug.log'), "Token exchange response: " . json_encode($data) . "\n", FILE_APPEND);

            if (!isset($data['access_token'])) {
                file_put_contents(storage_path('debug.log'), "ERROR: Failed to get access token\n", FILE_APPEND);
                return redirect()->route('login')
                    ->with('error', 'Failed to get access token from Google.');
            }

            $userResponse = \Illuminate\Support\Facades\Http::withToken($data['access_token'])->get('https://www.googleapis.com/oauth2/v2/userinfo');

            $googleUser = $userResponse->json();
            file_put_contents(storage_path('debug.log'), "Google user data: " . json_encode($googleUser) . "\n", FILE_APPEND);

            $user = User::where('email', $googleUser['email'])->first();

            if (!$user) {
                file_put_contents(storage_path('debug.log'), "Creating new user with email: " . $googleUser['email'] . "\n", FILE_APPEND);
                $user = User::create([
                    'name' => $googleUser['name'],
                    'email' => $googleUser['email'],
                    'password' => Hash::make(Str::random(40)), // Random password
                    'email_verified_at' => now(),
                    'google_id' => $googleUser['id'],
                    'walletAmount' => 0, // Default wallet amount
                ]);
                file_put_contents(storage_path('debug.log'), "New user created with ID: " . $user->id . "\n", FILE_APPEND);
            } elseif ($user->google_id !== $googleUser['id']) {
                file_put_contents(storage_path('debug.log'), "Updating existing user with Google ID\n", FILE_APPEND);
                $user->update(['google_id' => $googleUser['id']]);
                file_put_contents(storage_path('debug.log'), "User updated successfully\n", FILE_APPEND);
            }

            file_put_contents(storage_path('debug.log'), "Logging in user ID: " . $user->id . "\n", FILE_APPEND);
            Auth::login($user);
            $request->session()->regenerate();

            // Mark user as email verified if they came from Google
            if (!$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
                file_put_contents(storage_path('debug.log'), "Marked email as verified for Google user\n", FILE_APPEND);
            }

            file_put_contents(storage_path('debug.log'), "Redirecting to dashboard\n", FILE_APPEND);

            if (Auth::check() && Auth::user()->isAdmin) {
                return redirect()->intended(route('admin.dashboard', absolute: false));
            } else {
                return redirect()->intended(route('dashboard', absolute: false));
            }
            
        } catch (\Exception $e) {
            // Simple debugging - write error to file
            file_put_contents(storage_path('debug.log'), "EXCEPTION: " . $e->getMessage() . "\n", FILE_APPEND);
            file_put_contents(storage_path('debug.log'), "TRACE: " . $e->getTraceAsString() . "\n", FILE_APPEND);

            return redirect()->route('login')
                ->with('error', 'Google authentication failed. Please try again.');
        }
    }
}
