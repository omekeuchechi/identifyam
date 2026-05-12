<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\SecurityAlert;
use App\Models\SecurityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SecurityMonitorMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        
        if ($user) {
            // Log user activity with IP and other security info
            $this->logSecurityActivity($request, $user);
            
            // Check for suspicious activities
            $this->checkForSuspiciousActivity($request, $user);
            
            // Monitor wallet amount changes
            $this->monitorWalletChanges($request, $user);
        }
        
        return $next($request);
    }
    
    /**
     * Log security-related activity
     */
    private function logSecurityActivity(Request $request, User $user)
    {
        $securityData = [
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'session_id' => session()->getId(),
            'timestamp' => now(),
            'browser_fingerprint' => $this->generateBrowserFingerprint($request),
            'location' => $this->getLocationFromIp($request->ip()),
        ];
        
        // Store in security logs
        SecurityLog::create($securityData);
        
        // Log to file for monitoring
        Log::channel('security')->info('User activity monitored', $securityData);
    }
    
    /**
     * Check for suspicious activities
     */
    private function checkForSuspiciousActivity(Request $request, User $user)
    {
        $ip = $request->ip();
        
        // Check for multiple IPs from same user
        $recentIps = SecurityLog::where('user_id', $user->id)
            ->where('created_at', '>', now()->subHours(24))
            ->distinct('ip_address')
            ->count();
            
        if ($recentIps > 3) {
            $this->sendSecurityAlert($user, 'Multiple IP Addresses Detected', [
                'ip_addresses' => $recentIps,
                'current_ip' => $ip,
                'timeframe' => '24 hours'
            ]);
        }
        
        // Check for rapid requests (possible bot/DDoS)
        $recentRequests = SecurityLog::where('ip_address', $ip)
            ->where('created_at', '>', now()->subMinutes(5))
            ->count();
            
        if ($recentRequests > 100) {
            $this->sendSecurityAlert($user, 'Suspicious Activity - High Request Rate', [
                'requests_count' => $recentRequests,
                'timeframe' => '5 minutes',
                'ip' => $ip
            ]);
        }
        
        // Check for admin access from unusual locations
        if ($user->isAdmin && $this->isUnusualLocation($ip)) {
            $this->sendSecurityAlert($user, 'Admin Access from Unusual Location', [
                'ip' => $ip,
                'location' => $this->getLocationFromIp($ip)
            ]);
        }
    }
    
    /**
     * Monitor wallet amount changes
     */
    private function monitorWalletChanges(Request $request, User $user)
    {
        // Only monitor requests that could affect wallet
        $walletEndpoints = [
            'wallet/fund',
            'wallet/transfer',
            'profile/update',
            'admin/users/update'
        ];
        
        $currentPath = $request->path();
        
        if (collect($walletEndpoints)->contains(function($endpoint) use ($currentPath) {
            return str_contains($currentPath, $endpoint);
        })) {
            // Get original wallet amount
            $originalWallet = $user->getOriginal('walletAmount');
            
            // Check after request is processed (in terminate method)
            app()->terminating(function() use ($user, $originalWallet, $request) {
                $user->refresh();
                $newWallet = $user->walletAmount;
                
                if ($newWallet != $originalWallet) {
                    $this->logWalletChange($user, $originalWallet, $newWallet, $request);
                    
                    // Check for suspicious changes
                    if ($this->isSuspiciousWalletChange($originalWallet, $newWallet, $request)) {
                        $this->sendSecurityAlert($user, 'Suspicious Wallet Activity Detected', [
                            'original_amount' => $originalWallet,
                            'new_amount' => $newWallet,
                            'difference' => $newWallet - $originalWallet,
                            'endpoint' => $request->path(),
                            'ip' => $request->ip(),
                            'method' => $request->method()
                        ]);
                    }
                }
            });
        }
    }
    
    /**
     * Check if wallet change is suspicious
     */
    private function isSuspiciousWalletChange($original, $new, Request $request)
    {
        $difference = $new - $original;
        
        // Large increase without funding endpoint
        if ($difference > 10000 && !str_contains($request->path(), 'wallet/fund')) {
            return true;
        }
        
        // Direct database manipulation (no proper request flow)
        if ($request->method() === 'GET' && $difference !== 0) {
            return true;
        }
        
        // Multiple rapid changes
        $recentChanges = SecurityLog::where('user_id', Auth::user()->id())
            ->where('created_at', '>', now()->subMinutes(10))
            ->where('activity_type', 'wallet_change')
            ->count();
            
        if ($recentChanges > 5) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Log wallet changes
     */
    private function logWalletChange(User $user, $original, $new, Request $request)
    {
        SecurityLog::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'activity_type' => 'wallet_change',
            'details' => json_encode([
                'original_amount' => $original,
                'new_amount' => $new,
                'difference' => $new - $original,
                'endpoint' => $request->path(),
                'method' => $request->method(),
                'user_agent' => $request->userAgent()
            ]),
            'severity' => abs($new - $original) > 10000 ? 'high' : 'medium'
        ]);
    }
    
    /**
     * Generate browser fingerprint
     */
    private function generateBrowserFingerprint(Request $request)
    {
        return md5($request->userAgent() . $request->ip() . $request->header('Accept-Language'));
    }
    
    /**
     * Get location from IP
     */
    private function getLocationFromIp($ip)
    {
        try {
            $response = file_get_contents("http://ip-api.com/json/{$ip}");
            $data = json_decode($response, true);
            
            return [
                'country' => $data['country'] ?? 'Unknown',
                'city' => $data['city'] ?? 'Unknown',
                'isp' => $data['isp'] ?? 'Unknown'
            ];
        } catch (\Exception $e) {
            return ['country' => 'Unknown', 'city' => 'Unknown', 'isp' => 'Unknown'];
        }
    }
    
    /**
     * Check if location is unusual for admin
     */
    private function isUnusualLocation($ip)
    {
        // Get known admin locations
        $knownLocations = ['192.168.1.1', '127.0.0.1']; // Add your trusted IPs
        
        return !in_array($ip, $knownLocations);
    }
    
    /**
     * Send security alert email
     */
    private function sendSecurityAlert(User $user, $alertType, $details)
    {
        try {
            Mail::to('omekejoseph97@gmail.com')->send(new SecurityAlert($user, $alertType, $details));
            
            // Log the alert
            Log::channel('security')->critical("Security Alert: {$alertType}", [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'details' => $details,
                'timestamp' => now()
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to send security alert', [
                'error' => $e->getMessage(),
                'alert_type' => $alertType
            ]);
        }
    }
}
