<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\lagacy_nin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display admin dashboard
     */
    public function index()
    {
        return Inertia::render('Admin');
    }

    /**
     * Get admin statistics
     */
    public function getStats()
    {
        try {
            // Get total users
            $totalUsers = User::count();
            
            // Get active users (users who logged in within last 30 days)
            // Check if last_login_at column exists, otherwise use updated_at
            $activeUsers = User::where(function($query) {
                if (Schema::hasColumn('users', 'last_login_at')) {
                    $query->where('last_login_at', '>=', now()->subDays(30));
                } else {
                    $query->where('updated_at', '>=', now()->subDays(30));
                }
            })->count();
            
            // Get NIN verifications - check if table exists
            $totalNinVerifications = 0;
            $todayVerifications = 0;
            
            try {
                if (Schema::hasTable('lagacy_nins')) {
                    $totalNinVerifications = lagacy_nin::count();
                    $todayVerifications = lagacy_nin::whereDate('created_at', today())->count();
                }
            } catch (\Exception $e) {
                // Table doesn't exist or other issue, keep values as 0
            }

            return response()->json([
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'totalNinVerifications' => $totalNinVerifications,
                'todayVerifications' => $todayVerifications
            ]);
        } catch (\Exception $e) {
            // Return default values if there's any error
            return response()->json([
                'totalUsers' => 0,
                'activeUsers' => 0,
                'totalNinVerifications' => 0,
                'todayVerifications' => 0,
                'error' => 'Failed to fetch statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all users
     */
    public function getUsers()
    {
        $users = User::latest()->paginate(10);
        
        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    /**
     * Get NIN verification requests
     */
    public function getNinRequests()
    {
        $requests = lagacy_nin::with(['user'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/NinRequests', [
            'requests' => $requests
        ]);
    }

    /**
     * Get system logs
     */
    public function getSystemLogs()
    {
        $logs = [];
        
        try {
            $logFile = storage_path('logs/lagacy_nins.log');
            if (file_exists($logFile)) {
                $lines = file($logFile);
                $logs = array_slice(array_reverse($lines), 0, 100); // Last 100 lines
            }
        } catch (\Exception $e) {
            // Return empty if log file can't be read
        }

        return Inertia::render('Admin/SystemLogs', [
            'logs' => $logs
        ]);
    }

    /**
     * Get system settings page
     */
    public function getSettings()
    {
        return Inertia::render('Admin/Settings');
    }
}
