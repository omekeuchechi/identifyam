<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Mail\VerificationEmail;

class EmailController extends Controller
{
    /**
     * Send verification email.
     */
    public function sendVerification(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('error', 'Email not found.');
        }

        if ($user->hasVerifiedEmail()) {
            return back()->with('error', 'Email is already verified.');
        }

        $verificationCode = Str::random(6);
        
        $user->update([
            'email_verification_code' => $verificationCode,
            'email_verification_expires_at' => now()->addMinutes(15),
        ]);

        Mail::to($user->email)->send(new VerificationEmail($user, $verificationCode));

        return back()->with('success', 'Verification code sent to your email.');
    }

    /**
     * Verify email with code.
     */
    public function verify(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)
            ->where('email_verification_code', $request->code)
            ->where('email_verification_expires_at', '>', now())
            ->first();

        if (!$user) {
            return back()->with('error', 'Invalid or expired verification code.');
        }

        $user->update([
            'email_verified_at' => now(),
            'email_verification_code' => null,
            'email_verification_expires_at' => null,
        ]);

        return redirect()->route('login')
            ->with('success', 'Email verified successfully! You can now login.');
    }

    /**
     * Show email verification page.
     */
    public function show(): \Inertia\Response
    {
        return Inertia::render('Auth/VerifyEmail');
    }
}
