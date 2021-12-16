<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('/users')->group(function () {
    Route::post("/register", [AuthController::class, 'register']);
    Route::post("/login", [AuthController::class, 'login']);
    Route::middleware("auth:sanctum")->group(function () {
        Route::get("/", [AuthController::class, 'allUsers']);
        Route::get("/profile", [AuthController::class, 'profile']);
        Route::get("/orders", [AuthController::class, 'getAllOrders']);
        Route::post("/profilePhoto", [AuthController::class, 'updateProfilePhoto']);
        Route::put("/profile", [AuthController::class, 'updateProfile']);
        Route::put("/change-password", [AuthController::class, 'updatePassword']);
        Route::put("/{id}/change-role", [AuthController::class, 'updateRole']);
    });
});

Route::prefix('/categories')->group(function () {
    Route::get("/", [CategoryController::class, 'getAllCategories']);
    Route::middleware("auth:sanctum")->group(function () {
        Route::post('/', [CategoryController::class, 'addNewCategory']);
        Route::post('/{id}/changeImage', [CategoryController::class, 'changeImage']);
        Route::put("/{id}", [CategoryController::class, 'updateCategory']);
        Route::delete("/{id}", [CategoryController::class, 'deleteCategory']);
    });
});

Route::prefix('/products')->group(function () {
    Route::get("/", [ProductController::class, 'getProducts']);
    Route::get("/{id}", [ProductController::class, 'getProduct']);
    Route::middleware("auth:sanctum")->group(function () {
        Route::post('/', [ProductController::class, 'addNewProduct']);
        Route::post('/{id}/changeImage', [ProductController::class, 'changeImage']);
        Route::put("/{id}", [ProductController::class, 'updateProduct']);
        Route::delete("/{id}", [ProductController::class, 'deleteProduct']);
    });
});

Route::prefix('/coupons')->group(function () {
    Route::get("/{code}", [CouponController::class, 'getCoupon']);
    Route::middleware("auth:sanctum")->group(function () {
        Route::get("/", [CouponController::class, 'getAllCoupons']);
        Route::post('/', [CouponController::class, 'addNewCoupon']);
        Route::delete("/{id}", [CouponController::class, 'deleteCoupon']);
    });
});

Route::prefix('/orders')->group(function () {
    Route::post('/', [OrderController::class, 'createOrder']);
    Route::post('/{id}/mark-as-paid', [OrderController::class, 'markOrderAsPaid']);
    Route::middleware("auth:sanctum")->group(function () {
        Route::get("/", [OrderController::class, 'getOrders']);
        Route::put('/{id}/mark', [OrderController::class, 'markOrderAsCompleted']);
        Route::delete('/{id}', [OrderController::class, 'deleteOrder']);
    });
});
