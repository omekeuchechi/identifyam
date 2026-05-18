<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\UserActivity;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

abstract class Controller
{
    /**
     * Log user activity (Generic).
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
                'details' => $details,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log activity: ' . $e->getMessage());
        }
    }

    /**
     * Log specific business activity (History).
     */
    protected function logUserActivity($type, $action, $description, $amount = null, $reference = null, $details = [], $status = 'success')
    {
        try {
            $user = Auth::user();
            if (!$user) return;

            UserActivity::create([
                'user_id' => $user->id,
                'type' => $type,
                'action' => $action,
                'description' => $description,
                'amount' => $amount,
                'reference' => $reference,
                'status' => $status,
                'details' => $details,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log user activity: ' . $e->getMessage());
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
            'google_login' => 'Google login successful',
            'exam_card_purchase' => 'Exam card purchased',
            'exam_card_download' => 'Exam card PDF downloaded'
        ];

        return $descriptions[$action] ?? 'Unknown action';
    }
}
