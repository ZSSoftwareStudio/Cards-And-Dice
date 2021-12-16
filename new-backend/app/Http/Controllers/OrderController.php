<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Mollie\Laravel\Facades\Mollie;

class OrderController extends Controller
{
    public function getOrders()
    {
        return Order::all();
    }

    public function markOrderAsPaid($id)
    {

        $order = Order::find($id);
        $order->update([
            'status' => 'incomplete'
        ]);

        return $order;
    }

    public function preparePayment($amount, $id)
    {

        $payment = Mollie::api()->payments()->create([
            'amount' => [
                'currency' => 'EUR', // Type of currency you want to send
                'value' => strval($amount) . '.00', // You must send the correct number of decimals, thus we enforce the use of strings
            ],
            'description' => 'Payments By Cards & Dice',
            'redirectUrl' => env("FRONTEND_URL", 'https://cardsanddice.nl') . '/order-success?orderId=' . $id,
            'webhookUrl' => env("BACKEND_URL", 'https://cardsanddice.nl/api') . '/orders/' . $id . '/mark-as-paid',
        ]);

        $payment = Mollie::api()->payments()->get($payment->id);

        // redirect customer to Mollie checkout page
        return response([
            'url' => $payment->getCheckoutUrl()
        ]);
    }


    public function createOrder(Request $request)
    {
        $request->validate([
            "totalPrice" => 'required',
            "products" => 'required',
            "name" => 'required',
            "email" => 'required',
            "phone" => 'required',
            "address" => 'required',
            "country" => 'required',
            "state" => 'required',
            "zipcode" => 'required',
            "couponcode" => 'nullable',
            "password" => 'nullable'
        ]);
        $order = Order::create([
            "totalPrice" => $request->totalPrice,
            "products" => $request->products,
            "name" => $request->name,
            "email" => $request->email,
            "phone" => $request->phone,
            "address" => $request->address,
            "country" => $request->country,
            "state" => $request->state,
            "zipcode" => $request->zipcode,
            "couponcode" => $request->couponcode,
        ]);

        $user = User::where('email', $request->email)->get();
        if (!$user) {
            User::create([
                'name' => $request['name'],
                'email' => $request['email'],
                'phone' => $request['phone'],
                'address' => $request['address'],
                'state' => $request['state'],
                'country' => $request['country'],
                'zipcode' => $request['zipcode'],
                'password' => Hash::make($request['password'])
            ]);
            return $this->preparePayment($request->totalPrice + '.00', $order->id);
        } else {
            return $this->preparePayment($request->totalPrice + '.00', $order->id);
        }
    }

    public function markOrderAsCompleted($id)
    {
        $order = Order::find($id);
        if (strtolower($order["status"]) == "incomplete") {
            $order->update([
                'status' => 'complete'
            ]);

            return response([
                "message" => "Successfully Updated"
            ]);
        } else {
            $order->update([
                'status' => 'incomplete'
            ]);

            return response([
                "message" => "Successfully Updated"
            ]);
        }
    }

    public function deleteOrder($id)
    {
        $order = Order::find($id);
        if (strtolower($order["status"]) == "unpaid") {
            $isDeleted = Order::destroy($id);

            if ($isDeleted) {
                return response([
                    "message" => "Successfully deleted"
                ]);
            } else {
                return response([
                    "message" => "Couldn't delete this order!"
                ]);
            }
        } else {
            return response([
                "message" => "You can't delete this order"
            ]);
        }
    }
}
