import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import Order from '../model/Order';
import Product from '../model/Product';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  userToken = new BehaviorSubject(this.access_token);
  orders = new BehaviorSubject(this._orders);

  constructor(private router: Router) {}

  set access_token(value) {
    this.userToken.next(value); // this will make sure to tell every subscriber about the change.
    if (value === null) {
      this.router.navigateByUrl('/');
      localStorage.removeItem('access_token');
    } else {
      localStorage.setItem('access_token', value);
    }
  }

  get access_token() {
    return localStorage.getItem('access_token');
  }

  set _orders(value) {
    this.orders.next(value); // this will make sure to tell every subscriber about the change.
    if (value === null) {
      localStorage.removeItem('orders');
    } else {
      localStorage.setItem('orders', JSON.stringify(value));
    }
  }

  get _orders() {
    if (localStorage.getItem('orders') === null) {
      return {
        products: [],
        totalPrice: 0,
        couponcode: '',
      } as Order;
    }
    return JSON.parse(localStorage.getItem('orders')) as Order;
  }

  decodeJWT(token: string) {
    try {
      return jwt_decode(token);
    } catch (err) {
      return null;
    }
  }

  addOrder(product: Product, quantity: number) {
    let products = this._orders.products;
    const currentProduct = products.find((item) => item.product == product.id);

    if (currentProduct === undefined) {
      products.push({
        product: product.id,
        quantity: quantity,
      });
    } else {
      const index = products.indexOf(currentProduct);
      products[index].quantity = products[index].quantity + quantity;
    }

    const price = product.price * quantity;
    const totalPrice = this._orders.totalPrice + price;

    this._orders = {
      products,
      totalPrice,
      couponcode: this._orders.couponcode,
    };
  }

  deleteItem(product: Product) {
    let products = this._orders.products;
    const currentProduct = products.find((item) => item.product == product.id);

    if (currentProduct !== undefined) {
      const index = products.indexOf(currentProduct);

      const price = product.price * currentProduct.quantity;
      const totalPrice = this._orders.totalPrice - price;
      products.splice(index, 1);

      this._orders = {
        products,
        totalPrice,
        couponcode: this._orders.couponcode,
      };
    }
  }

  decrementProductQuantity(product: Product, quantity: number) {
    let products = this._orders.products;
    const currentProduct = products.find((item) => item.product == product.id);

    if (currentProduct !== undefined) {
      const index = products.indexOf(currentProduct);

      if (products[index].quantity > 1) {
        products[index].quantity = products[index].quantity - quantity;

        const price = product.price * quantity;
        const totalPrice = this._orders.totalPrice - price;

        this._orders = {
          products,
          totalPrice,
          couponcode: this._orders.couponcode,
        };
      }
    }
  }

  addDiscount(code: string, discount: number) {
    this._orders = {
      ...this._orders,
      totalPrice: this._orders.totalPrice * discount,
      couponcode: code,
    };
  }
}
