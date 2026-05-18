<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\lagacy_nin;
use App\Models\SecurityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $stats = $this->getStatsData();
        return Inertia::render('Admin/Admin', [
            'initialStats' => $stats
        ]);
    }

    /**
     * Get admin statistics data (helper)
     */
    private function getStatsData()
    {
        try {
            // Get total users
            $totalUsers = User::count();
            
            // Get active users (users who logged in within last 30 days)
            $activeUsers = User::where(function($query) {
                if (Schema::hasColumn('users', 'last_login_at')) {
                    $query->where('last_login_at', '>=', now()->subDays(30));
                } else {
                    $query->where('updated_at', '>=', now()->subDays(30));
                }
            })->count();
            
            // Get NIN verifications - use UserActivity for accurate counts
            $totalNinVerifications = \App\Models\UserActivity::where('type', 'nin_search')
                ->where('status', 'success')
                ->count();
            
            $todayVerifications = \App\Models\UserActivity::where('type', 'nin_search')
                ->where('status', 'success')
                ->whereDate('created_at', today())
                ->count();

            return [
                'totalUsers' => $totalUsers,
                'activeUsers' => $activeUsers,
                'totalNinVerifications' => $totalNinVerifications,
                'todayVerifications' => $todayVerifications
            ];
        } catch (\Exception $e) {
            return [
                'totalUsers' => 0,
                'activeUsers' => 0,
                'totalNinVerifications' => 0,
                'todayVerifications' => 0
            ];
        }
    }

    /**
     * Get admin statistics (JSON endpoint)
     */
    public function getStats()
    {
        return response()->json($this->getStatsData());
    }

    /**
     * Get all users
     */
    public function getUsers()
    {
        $users = User::latest()->paginate(10);
        
        // Get security logs for each user
        $users->getCollection()->transform(function ($user) {
            $user->recent_security_logs = \App\Models\SecurityLog::where('user_id', $user->id)
                ->latest()
                ->limit(5)
                ->get();
            
            $user->suspicious_activities = \App\Models\SecurityLog::where('user_id', $user->id)
                ->whereIn('severity', ['high', 'critical'])
                ->count();
                
            // Get last login IP from security logs or current request
                $user->last_login_ip = \App\Models\SecurityLog::where('user_id', $user->id)
                    ->where('activity_type', 'login')
                    ->latest()
                    ->value('ip_address') ?? request()->ip();
                
            return $user;
        });
        
        return Inertia::render('Admin/Users', [
            'users' => $users,
            'securityStats' => [
                'totalSecurityLogs' => \App\Models\SecurityLog::count(),
                'highSeverityLogs' => \App\Models\SecurityLog::where('severity', 'high')->count(),
                'criticalSeverityLogs' => \App\Models\SecurityLog::where('severity', 'critical')->count(),
                'todayLogs' => \App\Models\SecurityLog::whereDate('created_at', today())->count(),
            ]
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

    public function getNinProfit()
    {
        // Get NIN related activities from UserActivity for more accurate financial stats
        $ninActivities = \App\Models\UserActivity::where('type', 'nin_search')
            ->where('status', 'success');
        
        $totalRequests = $ninActivities->count();
        $totalRevenue = $ninActivities->sum('amount');
        
        // External API cost is fixed at 140 per successful request
        $externalApiCostPerRequest = 140;
        $totalCost = $totalRequests * $externalApiCostPerRequest;
        $totalProfit = $totalRevenue - $totalCost;

        // Calculate averages
        $avgDailyProfit = $totalRequests > 0 ? $totalProfit / max(1, ceil($totalRequests / 30)) : 0;
        $avgMonthlyProfit = $avgDailyProfit * 30;
        $avgYearlyProfit = $avgMonthlyProfit * 12;

        // Get total wallet balance from all users
        $totalWalletBalance = User::sum('walletAmount');

        // Get profit data for graph (last 30 days)
        $profitData = \App\Models\UserActivity::where('type', 'nin_search')
            ->where('status', 'success')
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(amount) - (COUNT(*) * ?) as daily_profit', [$externalApiCostPerRequest])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return [
                    'date' => $item->date,
                    'profit' => (float) $item->daily_profit
                ];
            });

        // Still get the requests for the table
        $requests = lagacy_nin::with(['user'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/NinProfit', [
            'requests' => $requests,
            'analytics' => [
                'totalRequests' => $totalRequests,
                'totalRevenue' => $totalRevenue,
                'totalProfit' => $totalProfit,
                'avgDailyProfit' => $avgDailyProfit,
                'avgMonthlyProfit' => $avgMonthlyProfit,
                'avgYearlyProfit' => $avgYearlyProfit,
                'totalWalletBalance' => $totalWalletBalance,
                'externalApiCost' => $externalApiCostPerRequest
            ],
            'profitData' => $profitData
        ]);
    }

    /**
     * Log current user IP for testing
     */
    public function logCurrentUserIP()
    {
        $user = Auth::user();
        if ($user) {
            SecurityLog::create([
                'user_id' => $user->id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'url' => request()->fullUrl(),
                'method' => request()->method(),
                'session_id' => session()->getId(),
                'browser_fingerprint' => md5(request()->userAgent() . request()->ip()),
                'location' => json_encode(['city' => 'Unknown', 'country' => 'Unknown']),
                'activity_type' => 'manual_ip_test',
                'details' => json_encode(['action' => 'Manual IP logging test']),
                'severity' => 'low'
            ]);
            
            return response()->json([
                'success' => true,
                'ip' => request()->ip(),
                'message' => 'IP logged successfully'
            ]);
        }
        
        return response()->json(['success' => false, 'message' => 'User not authenticated'], 401);
    }

    /**
     * Get security monitoring data
     */
    public function getSecurityMonitoring()
    {
        // Get recent security logs
        $logs = SecurityLog::with('user')
            ->latest()
            ->limit(100)
            ->get();
            
        // Get security statistics
        $stats = [
            'totalLogs' => SecurityLog::count(),
            'highSeverity' => SecurityLog::where('severity', 'high')->count(),
            'criticalSeverity' => SecurityLog::where('severity', 'critical')->count(),
            'todayLogs' => SecurityLog::whereDate('created_at', today())->count(),
            'activeUsers' => SecurityLog::where('created_at', '>', now()->subHours(24))
                ->distinct('user_id')
                ->count(),
            'suspiciousIPs' => SecurityLog::where('created_at', '>', now()->subHours(24))
                ->distinct('ip_address')
                ->count(),
            'walletAttacks' => SecurityLog::where('activity_type', 'wallet_change')
                ->where('severity', 'high')
                ->count(),
        ];
        
        return response()->json([
            'logs' => $logs,
            'stats' => $stats
        ]);
    }

    public function securityMonitoring()
    {
        // Get recent security logs
        $logs = SecurityLog::with('user')
            ->latest()
            ->limit(100)
            ->get();
            
        // Get security statistics
        $stats = [
            'totalLogs' => SecurityLog::count(),
            'highSeverity' => SecurityLog::where('severity', 'high')->count(),
            'criticalSeverity' => SecurityLog::where('severity', 'critical')->count(),
            'todayLogs' => SecurityLog::whereDate('created_at', today())->count(),
            'activeUsers' => SecurityLog::where('created_at', '>', now()->subHours(24))
                ->distinct('user_id')
                ->count(),
            'suspiciousIPs' => SecurityLog::where('created_at', '>', now()->subHours(24))
                ->distinct('ip_address')
                ->count(),
            'walletAttacks' => SecurityLog::where('activity_type', 'wallet_change')
                ->where('severity', 'high')
                ->count(),
        ];

        return Inertia::render('Admin/SecurityMonitoring', [
            'initialLogs' => $logs,
            'initialStats' => $stats
        ]);
    }

    /**
     * Get system logs
     */
    public function getSystemLogs()
    {
        
        // Get recent security logs
        $securityLogs = SecurityLog::with('user')
            ->latest()
            ->limit(100)
            ->get();
            
        // Get application logs (if available)
        $appLogs = [];
        
        try {
            $logFile = storage_path('logs/lagacy_nins.log');
            if (file_exists($logFile)) {
                $lines = file($logFile);
                $appLogs = array_slice(array_reverse($lines), 0, 100); // Last 100 lines
            }
        } catch (\Exception $e) {
            // Return empty if log file can't be read
        }

        return Inertia::render('Admin/SystemLogs', [
            'securityLogs' => $securityLogs,
            'appLogs' => $appLogs
        ]);
    }

    public function clearSystemLogs()
    {
        try {
            // Clear application logs
            $logFile = storage_path('logs/lagacy_nins.log');
            if (file_exists($logFile)) {
                file_put_contents($logFile, '');
            }
            
            // Clear security logs (optional - you might want to keep these)
            // $clearedSecurityLogs = SecurityLog::count();
            // SecurityLog::truncate();
            
            return response()->json([
                'success' => true,
                'message' => 'System logs cleared successfully',
                'cleared_app_logs' => file_exists($logFile),
                // 'cleared_security_logs' => $clearedSecurityLogs
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear system logs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get system settings page
     */
    public function getSettings()
    {
        return Inertia::render('Admin/Settings');
    }
}
