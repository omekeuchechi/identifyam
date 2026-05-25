<?php

namespace App\Http\Controllers;

use App\Events\UserActivityEvent;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HeartbeatController extends Controller
{
    /**
     * Handle heartbeat request to track user activity in real-time
     */
    public function heartbeat(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            // Dispatch user activity event for real-time tracking
            event(new UserActivityEvent(
                $user,
                $request->ip(),
                $request->userAgent(),
                'heartbeat',
                [
                    'timestamp' => now(),
                    'endpoint' => $request->path(),
                    'method' => $request->method()
                ]
            ));
            
            // Update user's last activity timestamp
            $user->last_activity_at = now();
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Heartbeat recorded successfully',
                'timestamp' => now(),
                'ip_address' => $request->ip(),
                'user_id' => $user->id
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Heartbeat failed: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get currently online users (active within last 5 minutes)
     */
    public function getOnlineUsers()
    {
        try {
            $fiveMinutesAgo = now()->subMinutes(5);
            
            $onlineUsers = \App\Models\User::where('last_activity_at', '>', $fiveMinutesAgo)
                ->with(['securityLogs' => function($query) {
                    $query->latest()->limit(1);
                }])
                ->get();
            
            $usersData = $onlineUsers->map(function($user) {
                $latestLog = $user->securityLogs->first();
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'current_ip' => $latestLog ? $latestLog->ip_address : null,
                    'last_activity' => $user->last_activity_at,
                    'user_agent' => $latestLog ? $latestLog->user_agent : null,
                ];
            });
            
            return response()->json([
                'success' => true,
                'online_users' => $usersData,
                'count' => $usersData->count(),
                'threshold' => '5 minutes'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get online users: ' . $e->getMessage()
            ], 500);
        }
    }
}
