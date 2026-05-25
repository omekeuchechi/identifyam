<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserActivityEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $ipAddress;
    public $userAgent;
    public $activityType;
    public $details;

    /**
     * Create a new event instance.
     */
    public function __construct(User $user, $ipAddress, $userAgent, $activityType = 'general', $details = [])
    {
        $this->user = $user;
        $this->ipAddress = $ipAddress;
        $this->userAgent = $userAgent;
        $this->activityType = $activityType;
        $this->details = $details;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new PrivateChannel('users.' . $this->user->id);
    }
}
