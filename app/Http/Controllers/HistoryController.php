<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use App\Models\UserActivity;
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
                // Admin can see all activities (merged from both tables)
                $businessActivities = UserActivity::with('user')->latest()->limit(50)->get();
                $genericLogs = ActivityLog::with('user')->latest()->limit(50)->get();
            } else {
                // Regular users see only their own activities
                $businessActivities = UserActivity::where('user_id', $user->id)->latest()->limit(50)->get();
                $genericLogs = ActivityLog::where('user_id', $user->id)->latest()->limit(50)->get();
            }

            // Map and merge
            $merged = $businessActivities->map(function($a) {
                return [
                    'id' => 'biz_' . $a->id,
                    'action' => $a->action,
                    'description' => $a->description,
                    'type' => $this->mapType($a->type),
                    'details' => $a->details,
                    'amount' => $a->amount,
                    'reference' => $a->reference,
                    'status' => $a->status,
                    'created_at' => $a->created_at,
                    'user' => $a->user ? ['name' => $a->user->name, 'email' => $a->user->email] : null
                ];
            })->concat($genericLogs->map(function($a) {
                return [
                    'id' => 'log_' . $a->id,
                    'action' => $a->action,
                    'description' => $a->description,
                    'type' => $a->type,
                    'details' => $a->details,
                    'created_at' => $a->created_at,
                    'user' => $a->user ? ['name' => $a->user->name, 'email' => $a->user->email] : null
                ];
            }))->sortByDesc('created_at')->values()->take(100);

            return response()->json([
                'activities' => $merged
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch user history: ' . $e->getMessage());
            return response()->json([
                'activities' => []
            ], 500);
        }
    }

    /**
     * Map UserActivity type to frontend-expected type.
     */
    private function mapType($type)
    {
        $map = [
            'funding' => 'transaction',
            'nin_search' => 'verification',
            'exam_card' => 'transaction'
        ];
        return $map[$type] ?? 'system';
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
