<?php

namespace App\Http\Controllers;

use App\Models\Code;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    public function getAllCoupons()
    {
        return Code::all();
    }

    public function getCoupon($code)
    {
        return Code::where('code', $code)->get();
    }

    public function addNewCoupon(Request $request)
    {
        $request->validate([
            "code" => 'required',
            "discount" => 'required'
        ]);

        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            return Code::create([
                'code' => $request->input('code'),
                'discount' => $request->input('discount'),
            ]);
        } else {
            return response([
                "message" => "You are not authenticated as an Admin or Staff"
            ]);
        }
    }

    public function deleteCoupon($id)
    {
        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            $isDeleted = Code::destroy($id);
            if ($isDeleted) {
                return response([
                    "message" => "Successfully deleted"
                ]);
            } else {
                return response([
                    "message" => "Couldn't delete"
                ]);
            }
        } else {
            return response([
                "message" => "You are not authenticated as an Admin or Staff"
            ]);
        }
    }
}
