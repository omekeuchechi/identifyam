<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_type_id',
        'card_name',
        'unit_amount',
        'availability',
    ];

    protected $casts = [
        'unit_amount' => 'decimal:2',
    ];
}
