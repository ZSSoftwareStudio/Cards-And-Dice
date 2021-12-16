<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'totalPrice',
        'products',
        'name',
        'email',
        'phone',
        'address',
        'country',
        'state',
        'zipcode',
        'couponcode',
        'status',
    ];
}
