<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        $response = ["message" => "Signup was successful!",];
        $newUser = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'role' => $request->input('role')
        ])->attributesToArray();

        return response(
            $newUser + $response
        );
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response([
                "message" => "Authentication failed!"
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = Auth::user()->createToken('token')->plainTextToken;

        return response([
            "access_token" => $token,
            "message" => "Login successful!",
        ]);
    }

    public function profile()
    {
        return Auth::user();
    }

    public function allUsers()
    {
        if (strtolower(Auth::user()["role"]) == "superuser") {
            return User::all();
        } else {
            return null;
        }
    }

    public function getAllOrders()
    {
        return Order::where('email', Auth::user()["email"])->orderBy('created_at')->get();
    }

    public function updateProfile(Request $request)
    {
        $id = Auth::user()["id"];

        $request->validate([
            "name" => "required",
            "address" => "required",
            "phone" => "required",
            "country" => "required",
            "state" => "required",
            "zipcode" => "required",
        ]);

        $user = User::find($id);
        $user->update($request->all());
        $message = [
            "message" => "Successfully Updated!"
        ];
        return $user->attributesToArray() + $message;
    }

    public function updatePassword(Request $request)
    {
        $id = Auth::user()["id"];

        $request->validate([
            "currentPassword" => "required",
            "newPassword" => "required",
        ]);

        $user = User::find($id);
        $hashedPassword = Auth::user()->password;

        if (Hash::check($request->input('currentPassword'), $hashedPassword)) {
            $user->update([
                "password" => Hash::make($request->input('newPassword'))
            ]);

            return response([
                "message" => "Successfully Updated!"
            ]);
        } else {
            return response([
                "message" => "Current Password doesn't match"
            ], Response::HTTP_UNAUTHORIZED);
        }
    }

    public function updateRole(Request $request, $id)
    {
        if (strtolower(Auth::user()["role"]) === "superuser") {
            $user = User::find($id);
            $user->update([
                "role" => $request->input('role')
            ]);

            return response([
                "message" => "Successfully Updated!"
            ]);
        } else {
            return response([
                "message" => "You are not authenticated as an Admin"
            ]);
        }
    }

    public function updateProfilePhoto(Request $request)
    {

        $request->validate([
            'image' => 'required|image:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $filename = rand(0, 99999) . '-' . $request->file('image')->getClientOriginalName();
            $request->file('image')->storeAs('users', $filename, 'public');
            User::where('id', Auth::user()["id"])->update(['image' => 'storage/users/' . $filename]);

            return response([
                "message" => "Successfully uploaded new profile photo!"
            ]);
        } else {
            return response(["message" => "No Image found", "image" => $request->image]);
        }
    }
}
