<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'email_verification_code',
        'email_verification_expires_at',
        'walletAmount',
        'isAdmin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verification_code',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'isAdmin' => 'boolean',
        ];
    }

    /**
     * Determine if the user is an administrator.
     *
     * @return bool
     */
    public function getIsAdminAttribute(): bool
    {
        return (bool) $this->isAdmin;
    }

    /**
     * Get the transactions for the user.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get formatted wallet balance.
     */
    public function getFormattedWalletBalanceAttribute(): string
    {
        return '₦' . number_format($this->walletAmount, 2);
    }

    /**
     * Add funds to wallet.
     */
    public function addToWallet(float $amount): bool
    {
        return $this->increment('walletAmount', $amount);
    }

    /**
     * Remove funds from wallet.
     */
    public function removeFromWallet(float $amount): bool
    {
        if ($this->walletAmount < $amount) {
            return false;
        }
        
        return $this->decrement('walletAmount', $amount);
    }

    /**
     * Check if user has sufficient wallet balance.
     */
    public function hasSufficientBalance(float $amount): bool
    {
        return $this->walletAmount >= $amount;
    }
}
