import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Coupon from 'src/app/model/Coupon';
import Order from 'src/app/model/Order';
import Product from 'src/app/model/Product';
import User from 'src/app/model/User';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  itemsLength: number = 0;
  totalPrice: number = 0;
  products = [];
  quantity = {};
  endPoint = environment.apiURL;
  checkOut = false;
  order: Order;
  currentUser = null;
  user = {
    name: '',
    email: '',
    phone: undefined,
    address: undefined,
    state: undefined,
    country: undefined,
    zipcode: undefined,
  };
  password: null;
  couponUsed = false;
  currency = environment.currency;

  constructor(
    private router: Router,
    private GlobalService: GlobalService,
    private APIService: APIService
  ) {
    document.title = 'Cart - Cards & Dice';
  }

  ngOnInit(): void {
    this.GlobalService.userToken.subscribe((newToken) => {
      this.currentUser = newToken;
      if (newToken !== null) {
        this.APIService.getUserProfile(newToken).subscribe((data: User) => {
          this.user = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            state: data.state,
            country: data.country,
            zipcode: data.zipcode,
          };
        });
      }
    });

    let products = [];
    this.GlobalService.orders.subscribe((order) => {
      products = [];
      this.itemsLength = order.products.length;
      this.totalPrice = order.totalPrice;
      this.order = order;
      this.couponUsed = order.couponcode === '' ? false : true;
      order.products.map((currentProduct) => {
        this.quantity[currentProduct.product] = currentProduct.quantity;
        this.APIService.getProduct(currentProduct.product).subscribe(
          (product: Product) => {
            products.push(product);
          }
        );
      });

      this.products = products;
    });
  }

  incrementProductQuantity(product: Product) {
    this.GlobalService.addOrder(product, 1);
  }

  decrementProductQuantity(product: Product) {
    this.GlobalService.decrementProductQuantity(product, 1);
  }

  deleteProductFromCart(product: Product) {
    this.GlobalService.deleteItem(product);
  }

  changeCheckOut(value: boolean) {
    this.checkOut = value;
  }

  createNewOrder() {
    let data = {
      totalPrice: this.totalPrice + 5,
      products: JSON.stringify(this.order.products),
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
      country: this.user.country,
      state: this.user.state,
      zipcode: this.user.zipcode,
      couponcode: this.order.couponcode ? this.order.couponcode : '',
      password: this.password,
    };
    console.log(data);
    this.APIService.createNewOrder(data).subscribe((data: { url: string }) => {
      console.log(data);
      window.location.href = data.url;
    });
  }

  addCouponCode() {
    if (!this.couponUsed) {
      this.APIService.getCoupon(this.order.couponcode).subscribe(
        (coupon: Coupon) => {
          console.log(coupon);
          this.GlobalService.addDiscount(coupon[0].code, coupon[0].discount);
          this.couponUsed = true;
        }
      );
    } else {
      alert('A coupon code has already been used');
    }
  }
}
