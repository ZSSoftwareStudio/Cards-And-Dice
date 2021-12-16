<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function getProducts()
    {
        return Product::all();
    }

    public function getProduct($id)
    {
        return Product::find($id);
    }

    public function addNewProduct(Request $request)
    {

        $request->validate([
            "title" => 'required',
            "description" => 'required',
            "price" => 'required',
            "category" => 'required',
            "image" => 'required|image:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            if ($request->hasFile('image')) {
                $filename = rand(0, 99999) . '-' . $request->file('image')->getClientOriginalName();
                $request->file('image')->storeAs('products', $filename, 'public');

                return response(
                    Product::create([
                        'title' => $request->input('title'),
                        'description' => $request->input('description'),
                        'price' => $request->input('price'),
                        'category' => $request->input('category'),
                        'image' => 'storage/products/' . $filename,
                        'owner' => Auth::user()["id"]
                    ])->attributesToArray() + ["message" => "Successfully Uploaded new Product"]
                );
            } else {
                return response(["message" => "No Image found", "image" => $request->image]);
            }
        } else {
            return response([
                "message" => "You are not authenticated as an Admin or Staff"
            ]);
        }
    }

    public function updateProduct(Request $request, $id)
    {
        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            $request->validate([
                "title" => "required",
                "description" => "required",
                "price" => "required",
                "category" => "required",
            ]);

            $product = Product::find($id);
            $product->update($request->all());
            return $product;
        } else {
            return response([
                "message" => "You are not authenticated as an Admin or Staff"
            ]);
        }
    }

    public function deleteProduct($id)
    {
        if (strtolower(Auth::user()["role"]) === "superuser" || strtolower(Auth::user()["role"]) === "staffuser") {
            Storage::disk("public")->delete('products/' . explode(Product::find($id)["image"], '/')[2]);

            $isDeleted = Product::destroy($id);
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

            Storage::disk("public")->delete('products/' . explode(Product::find($id)["image"], '/')[2]);


            if ($request->hasFile('image')) {
                $filename = rand(0, 99999) . '-' . $request->file('image')->getClientOriginalName();
                $request->file('image')->storeAs('products', $filename, 'public');
                Product::where('id', $id)->update(['image' => 'storage/products/' . $filename]);

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
