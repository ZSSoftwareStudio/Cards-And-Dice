<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function getAllCategories()
    {
        return Category::all();
    }

    public function addNewCategory(Request $request)
    {

        $request->validate([
            "title" => 'required',
            "image" => 'required|image:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            if ($request->hasFile('image')) {
                $filename = rand(0, 99999) . '-' . $request->file('image')->getClientOriginalName();
                $request->file('image')->storeAs('categories', $filename, 'public');

                return Category::create([
                    'title' => $request->input('title'),
                    'image' => 'storage/categories/' . $filename
                ]);
            } else {
                return response(["message" => "No Image found", "image" => $request->image]);
            }
        } else {
            return response([
                "message" => "You are not authenticated as an Admin or Staff"
            ]);
        }
    }

    public function updateCategory(Request $request, $id)
    {
        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            $request->validate([
                "title" => "required",
            ]);

            $category = Category::find($id);
            $category->update($request->all());
            return $category;
        } else {
            return response([
                "message" => "You are not authenticated as an Admin or Staff"
            ]);
        }
    }

    public function deleteCategory($id)
    {
        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            Storage::disk("public")->delete('categories/' . explode(Category::find($id)["image"], '/')[2]);

            $isDeleted = Category::destroy($id);
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

    public function changeImage(Request $request, $id)
    {
        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            $request->validate([
                'image' => 'required|image:jpeg,png,jpg,gif,svg|max:2048'
            ]);

            Storage::disk("public")->delete('categories/' . explode(Category::find($id)["image"], '/')[2]);


            if ($request->hasFile('image')) {
                $filename = rand(0, 99999) . '-' . $request->file('image')->getClientOriginalName();
                $request->file('image')->storeAs('categories', $filename, 'public');
                Category::where('id', $id)->update(['image' => 'storage/categories/' . $filename]);

                return response([
                    "message" => "Successfully uploaded new image!"
                ]);
            } else {
                return response(["message" => "No Image found", "image" => $request->image]);
            }
        } else {
            return response([
                "message" => "You are not authenticated as an Admin or Staff"
            ]);
        }
    }
}
