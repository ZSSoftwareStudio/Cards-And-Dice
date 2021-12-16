<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('totalPrice');
            $table->longText('products')->default('[]');
            $table->string('name', 255);
            $table->string('email');
            $table->string('phone', 20);
            $table->text("address");
            $table->string("country", 30);
            $table->string("state", 50);
            $table->string("zipcode", 100);
            $table->string('couponcode', 255)->nullable();
            $table->string('status')->default('unpaid');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
