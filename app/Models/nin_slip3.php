<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class nin_slip3 extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nin',
        'phone',
        'photo',
        'signature',
        'religion',
        'title',
        'surname',
        'firstname',
        'gender',
        'birthdate',
        'trackingId',
        'marital_status',
    ];
}
