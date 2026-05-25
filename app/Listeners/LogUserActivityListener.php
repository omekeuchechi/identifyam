<?php

namespace App\Listeners;

use App\Events\UserActivityEvent;
use App\Models\SecurityLog;
use Illuminate\Support\Facades\Log;

class LogUserActivityListener
{
    /**
     * Handle the event.
     */
    public function handle(UserActivityEvent $event)
    {
        try {
            SecurityLog::create([
                'user_id' => $event->user->id,
                'ip_address' => $event->ipAddress,
                'user_agent' => $event->userAgent,
                'url' => request()->fullUrl(),
                'method' => request()->method(),
                'session_id' => session()->getId(),
                'browser_fingerprint' => md5($event->userAgent . $event->ipAddress),
                'location' => json_encode(['city' => 'Unknown', 'country' => 'Unknown']),
                'activity_type' => $event->activityType,
                'details' => json_encode($event->details),
                'severity' => 'low'
            ]);

            Log::info('User activity logged via event', [
                'user_id' => $event->user->id,
                'ip_address' => $event->ipAddress,
                'activity_type' => $event->activityType
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log user activity via event', [
                'error' => $e->getMessage(),
                'user_id' => $event->user->id
            ]);
        }
    }
}
