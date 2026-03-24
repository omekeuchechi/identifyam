<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamCardPurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'card_type_id',
        'card_name',
        'quantity',
        'amount',
        'reference',
        'old_balance',
        'new_balance',
        'status',
        'message',
        'cards',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'old_balance' => 'decimal:2',
        'new_balance' => 'decimal:2',
        'cards' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
