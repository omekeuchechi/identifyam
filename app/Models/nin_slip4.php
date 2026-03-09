<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class nin_slip4 extends Model
{
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
        'lga',
        'trackingId',
        'marital_status',
    ];
}
