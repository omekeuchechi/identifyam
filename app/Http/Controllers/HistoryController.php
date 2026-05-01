<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class HistoryController extends Controller
{
    /**
     * Display the user history page.
     */
    public function index()
    {
        return Inertia::render('History');
    }

    /**
     * Get user activity history.
     */
    public function getUserHistory(Request $request)
    {
        try {
            $user = Auth::user();
            $activities = [];

            if ($user->isAdmin) {
                // Admin can see all activities
                $activities = ActivityLog::with('user')
                    ->latest()
                    ->limit(100)
                    ->get()
                    ->map(function ($activity) {
                        return [
                            'id' => $activity->id,
                            'action' => $activity->action,
                            'description' => $activity->description,
                            'details' => $activity->details,
                            'type' => $activity->type,
                            'ip_address' => $activity->ip_address,
                            'user_agent' => $activity->user_agent,
                            'created_at' => $activity->created_at,
                            'user' => $activity->user ? [
                                'name' => $activity->user->name,
                                'email' => $activity->user->email
                            ] : null
                        ];
                    });
            } else {
                // Regular users see only their own activities
                $activities = ActivityLog::where('user_id', $user->id)
                    ->latest()
                    ->limit(50)
                    ->get()
                    ->map(function ($activity) {
                        return [
                            'id' => $activity->id,
                            'action' => $activity->action,
                            'description' => $activity->description,
                            'details' => $activity->details,
                            'type' => $activity->type,
                            'ip_address' => $activity->ip_address,
                            'user_agent' => $activity->user_agent,
                            'created_at' => $activity->created_at
                        ];
                    });
            }

            return response()->json([
                'activities' => $activities
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch user history: ' . $e->getMessage());
            return response()->json([
                'activities' => []
            ], 500);
        }
    }

    /**
     * Clear cache.
     */
    public function clearCache(Request $request)
    {
        try {
            $user = Auth::user();
            $cacheType = $request->input('type', 'user');

            if ($cacheType === 'all' && $user->isAdmin) {
                // Admin can clear all cache
                Cache::flush();
                
                // Log the cache clear action
                $this->logActivity('cache_clear', 'Cleared all system cache', 'system', [
                    'cache_type' => 'all'
                ]);
                
                return response()->json([
                    'message' => 'All cache cleared successfully'
                ]);
            } else {
                // Users can only clear their own cache
                $userId = $user->id;
                
                // Clear user-specific cache
                Cache::forget("user_{$userId}_profile");
                Cache::forget("user_{$userId}_wallet");
                Cache::forget("user_{$userId}_transactions");
                Cache::forget("user_{$userId}_nin_verifications");
                
                // Log the cache clear action
                $this->logActivity('cache_clear', 'Cleared personal cache', 'system', [
                    'cache_type' => 'user'
                ]);
                
                return response()->json([
                    'message' => 'Your cache cleared successfully'
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to clear cache: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to clear cache',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log user activity.
     */
    public function logActivity($action, $description = null, $type = 'auth', $details = [])
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
            'google_login' => 'Google login successful',
            'exam_card_purchase' => 'Exam card purchased',
            'exam_card_download' => 'Exam card PDF downloaded'
        ];

        return $descriptions[$action] ?? 'Unknown action';
    }
}
