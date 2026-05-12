<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SecurityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ip_address',
        'user_agent',
        'url',
        'method',
        'session_id',
        'browser_fingerprint',
        'location',
        'activity_type',
        'details',
        'severity',
    ];

    protected $casts = [
        'location' => 'array',
        'details' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user that owns the security log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get high severity logs
     */
    public function scopeHighSeverity($query)
    {
        return $query->where('severity', 'high');
    }

    /**
     * Scope to get recent logs
     */
    public function scopeRecent($query, $hours = 24)
    {
        return $query->where('created_at', '>', now()->subHours($hours));
    }
}
