<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

abstract class Controller
{
    /**
     * Log user activity.
     */
    protected function logActivity($action, $description = null, $type = 'auth', $details = [])
    {
        try {
            $user = Auth::user();

            ActivityLog::create([
                'user_id' => $user ? $user->id : null,
                'action' => $action,
                'description' => $description ?: $this->getActionDescription($action),
                'type' => $type,
                'details' => json_encode($details),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            // Don't break the application if activity logging fails
            Log::error('Failed to log activity: ' . $e->getMessage());
        }
    }

    /**
     * Get human-readable action description.
     */
    private function getActionDescription($action)
    {
        $descriptions = [
            'login' => 'User logged in',
            'logout' => 'User logged out',
            'profile_update' => 'Profile information updated',
            'password_change' => 'Password changed',
            'nin_verification' => 'NIN verification completed',
            'wallet_transaction' => 'Wallet transaction processed',
            'bug_report' => 'Bug report submitted',
            'admin_login' => 'Admin logged in',
            'admin_action' => 'Admin action performed',
            'cache_clear' => 'Cache cleared',
            'email_verification' => 'Email verified',
            'google_login' => 'Google login successful'
        ];

        return $descriptions[$action] ?? 'Unknown action';
    }
}
