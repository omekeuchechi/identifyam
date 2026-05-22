<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AccountSwitched
{
    use Dispatchable, SerializesModels;

    public $userId;
    public $userName;
    public $previousGoogleId;
    public $newGoogleId;

    /**
     * Create a new event instance.
     *
     * @param int $userId
     * @param string $userName
     * @param string|null $previousGoogleId
     * @param string $newGoogleId
     */
    public function __construct(int $userId, string $userName, ?string $previousGoogleId, string $newGoogleId)
    {
        $this->userId = $userId;
        $this->userName = $userName;
        $this->previousGoogleId = $previousGoogleId;
        $this->newGoogleId = $newGoogleId;
    }
}
