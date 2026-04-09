<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class lagacy_nin extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nin',
        'telephone',
        'image',
        'surname',
        'first_name',
        'birth_data',
        'gender',
        'email',
        'search_type',
        'api_response',
        'api_version',
        'status',
        'user_id',
    ];

    /**
     * Get the user that owns the NIN record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
