<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];

}
