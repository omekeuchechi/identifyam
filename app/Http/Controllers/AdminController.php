<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\lagacy_nin;
use App\Models\SecurityLog;
use App\Models\ExamCardPurchase;
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
                
            // Get most recent IP address from security logs (real-time tracking)
                $user->last_login_ip = \App\Models\SecurityLog::where('user_id', $user->id)
                    ->latest()
                    ->value('ip_address');
                
                // Get IP statistics for this user
                $user->ip_history = \App\Models\SecurityLog::where('user_id', $user->id)
                    ->distinct('ip_address')
                    ->latest()
                    ->limit(5)
                    ->pluck('ip_address');
                
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
     * Get Exam Card Profit analytics
     */
    public function getExamProfit()
    {
        // Get exam card purchases (successful transactions)
        $examPurchases = ExamCardPurchase::where('status', 'success');
        
        $totalPurchases = $examPurchases->count();
        $totalRevenue = $examPurchases->sum('amount');
        $totalCardsSold = $examPurchases->sum('quantity');
        
        // For exam cards, the cost is typically the card purchase cost
        // Assuming a cost per card - adjust this based on your actual pricing model
        $costPerCard = 0; // Adjust based on your actual cost structure
        $totalCost = $totalCardsSold * $costPerCard;
        $totalProfit = $totalRevenue - $totalCost;

        // Calculate averages
        $avgDailyProfit = $totalPurchases > 0 ? $totalProfit / max(1, ceil($totalPurchases / 30)) : 0;
        $avgMonthlyProfit = $avgDailyProfit * 30;
        $avgYearlyProfit = $avgMonthlyProfit * 12;

        // Get total wallet balance from all users
        $totalWalletBalance = User::sum('walletAmount');

        // Get profit data for graph (last 30 days)
        $profitData = ExamCardPurchase::where('status', 'success')
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, SUM(amount) as daily_revenue, COUNT(*) as daily_purchases, SUM(quantity) as daily_cards')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) use ($costPerCard) {
                $dailyCost = $item->daily_cards * $costPerCard;
                return [
                    'date' => $item->date,
                    'revenue' => (float) $item->daily_revenue,
                    'purchases' => $item->daily_purchases,
                    'cards_sold' => $item->daily_cards,
                    'profit' => (float) ($item->daily_revenue - $dailyCost)
                ];
            });

        // Get recent purchases for the table
        $purchases = ExamCardPurchase::with(['user'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/ExamProfit', [
            'purchases' => $purchases,
            'analytics' => [
                'totalPurchases' => $totalPurchases,
                'totalRevenue' => $totalRevenue,
                'totalProfit' => $totalProfit,
                'totalCardsSold' => $totalCardsSold,
                'avgDailyProfit' => $avgDailyProfit,
                'avgMonthlyProfit' => $avgMonthlyProfit,
                'avgYearlyProfit' => $avgYearlyProfit,
                'totalWalletBalance' => $totalWalletBalance,
                'costPerCard' => $costPerCard
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

    /**
     * Get real-time IP address for a specific user
     */
    public function getUserRealTimeIP($userId)
    {
        try {
            $user = User::findOrFail($userId);
            
            // Get the most recent IP address from security logs
            $latestLog = \App\Models\SecurityLog::where('user_id', $userId)
                ->latest()
                ->first();
            
            // Get all distinct IPs used in last 24 hours
            $recentIPs = \App\Models\SecurityLog::where('user_id', $userId)
                ->where('created_at', '>', now()->subHours(24))
                ->distinct('ip_address')
                ->pluck('ip_address');
            
            return response()->json([
                'success' => true,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'current_ip' => $latestLog ? $latestLog->ip_address : null,
                'last_seen' => $latestLog ? $latestLog->created_at : null,
                'recent_ips' => $recentIPs,
                'total_unique_ips' => $recentIPs->count(),
                'is_online' => $latestLog && $latestLog->created_at->gt(now()->subMinutes(5))
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user IP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all users with their real-time IP addresses
     */
    public function getAllUsersRealTimeIPs()
    {
        try {
            // Get all users with their latest IP addresses
            $users = User::with(['securityLogs' => function($query) {
                $query->latest()->limit(1);
            }])->get();
            
            $usersData = $users->map(function($user) {
                $latestLog = $user->securityLogs->first();
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'current_ip' => $latestLog ? $latestLog->ip_address : null,
                    'last_seen' => $latestLog ? $latestLog->created_at : null,
                    'is_online' => $latestLog && $latestLog->created_at->gt(now()->subMinutes(5)),
                    'user_agent' => $latestLog ? $latestLog->user_agent : null,
                    'location' => $latestLog ? $latestLog->location : null
                ];
            });
            
            // Get statistics
            $onlineUsers = $usersData->where('is_online', true)->count();
            $uniqueIPs = $usersData->whereNotNull('current_ip')->unique('current_ip')->count();
            
            return response()->json([
                'success' => true,
                'users' => $usersData,
                'stats' => [
                    'total_users' => $usersData->count(),
                    'online_users' => $onlineUsers,
                    'unique_ips' => $uniqueIPs,
                    'offline_users' => $usersData->count() - $onlineUsers
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get users IPs: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Trigger user activity event (for testing)
     */
    public function triggerUserActivityEvent(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'User not authenticated'], 401);
            }

            // Dispatch the user activity event
            event(new \App\Events\UserActivityEvent(
                $user,
                $request->ip(),
                $request->userAgent(),
                $request->input('activity_type', 'manual_trigger'),
                $request->input('details', [])
            ));

            return response()->json([
                'success' => true,
                'message' => 'User activity event triggered successfully',
                'ip' => $request->ip()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to trigger event: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Manually log IP for all users (for testing purposes)
     */
    public function logAllUsersIPs()
    {
        try {
            $users = User::all();
            $loggedCount = 0;

            foreach ($users as $user) {
                // Create a sample security log entry with the admin's current IP
                // This is for testing purposes - in production, users should log their own IPs
                SecurityLog::create([
                    'user_id' => $user->id,
                    'ip_address' => request()->ip(), // Using current request IP as sample
                    'user_agent' => request()->userAgent(),
                    'url' => '/admin/log-all-ips',
                    'method' => 'GET',
                    'session_id' => session()->getId(),
                    'browser_fingerprint' => md5(request()->userAgent() . request()->ip()),
                    'location' => json_encode(['city' => 'Unknown', 'country' => 'Unknown']),
                    'activity_type' => 'manual_ip_log',
                    'details' => json_encode(['action' => 'Manual IP logging by admin']),
                    'severity' => 'low'
                ]);

                $loggedCount++;
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully logged IPs for {$loggedCount} users",
                'logged_count' => $loggedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to log user IPs: ' . $e->getMessage()
            ], 500);
        }
    }
}
