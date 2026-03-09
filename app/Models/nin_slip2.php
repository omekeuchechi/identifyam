<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class nin_slip2 extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nin',
        'telephoneno',
        'surname',
        'first_name',
        'birth_date',
        'gender',
        'email',
        'status',
    ];
}
