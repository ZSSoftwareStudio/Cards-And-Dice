import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import Product from '../model/Product';
import Category from '../model/Category';
import User from '../model/User';
import Coupon from '../model/Coupon';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  productsEndpoint: string = 'products';
  categoriesEndpoint: string = 'categories';
  usersEndpoint: string = 'users';
  ordersEndpoint: string = 'orders';
  couponsEndpoint: string = 'coupons';

  constructor(private http: HttpClient) {}

  registerNewUser(data: any, token: string) {
    return this.http.post(
      `${environment.apiURL}/${this.usersEndpoint}/register`,
      data,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  authenticateUserWithEmailAndPassword(data: {
    email: string;
    password: string;
  }) {
    return this.http.post(
      `${environment.apiURL}/${this.usersEndpoint}/login`,
      data
    );
  }

  authenticateUserWithSocialMedia(userData: User) {
    return this.http.post(
      `${environment.apiURL}/${this.usersEndpoint}/sociallogin`,
      userData
    );
  }

  updateUserProfilePhoto(formData: FormData, token: string) {
    return this.http.put(
      `${environment.apiURL}/${this.usersEndpoint}/profilePhoto`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  changeUserRole(id: string, token: string, role: string) {
    return this.http.put(
      `${environment.apiURL}/${this.usersEndpoint}/${id}/change-role`,
      {
        role,
      },
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  updateUserProfile(formData, token: string) {
    return this.http.put(
      `${environment.apiURL}/${this.usersEndpoint}/profile`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  updateUserPassword(formData, token: string) {
    return this.http.put(
      `${environment.apiURL}/${this.usersEndpoint}/change-password`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getProducts() {
    return this.http.get<Product[]>(
      `${environment.apiURL}/${this.productsEndpoint}/`
    );
  }

  getProduct(productId: string) {
    return this.http.get<Product>(
      `${environment.apiURL}/${this.productsEndpoint}/${productId}`
    );
  }

  uploadProduct(formData: FormData, token: string) {
    return this.http.post<Product>(
      `${environment.apiURL}/${this.productsEndpoint}/`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  uploadNewProductImage(formData: FormData, token: string, productId: string) {
    return this.http.put<Product>(
      `${environment.apiURL}/${this.productsEndpoint}/${productId}/changeImage`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  updateProduct(formData: any, productId: string, token: string) {
    return this.http.put<Product>(
      `${environment.apiURL}/${this.productsEndpoint}/${productId}`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  deleteProduct(productId: string, token: string) {
    return this.http.delete(
      `${environment.apiURL}/${this.productsEndpoint}/${productId}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getCategories() {
    return this.http.get<Category[]>(
      `${environment.apiURL}/${this.categoriesEndpoint}/`
    );
  }

  uploadCategory(formData: FormData, token: string) {
    return this.http.post<Category>(
      `${environment.apiURL}/${this.categoriesEndpoint}/`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  uploadNewCategoryImage(
    formData: FormData,
    token: string,
    categoryId: string
  ) {
    return this.http.put<Category>(
      `${environment.apiURL}/${this.categoriesEndpoint}/${categoryId}/changeImage`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  updateCategory(formData: any, categoryId: string, token: string) {
    return this.http.put<Category>(
      `${environment.apiURL}/${this.categoriesEndpoint}/${categoryId}`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  deleteCategory(categoryId: string, token: string) {
    return this.http.delete(
      `${environment.apiURL}/${this.categoriesEndpoint}/${categoryId}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getOrders(token: string) {
    return this.http.get<any[]>(
      `${environment.apiURL}/${this.usersEndpoint}/orders`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getAllUsers(token: string) {
    return this.http.get<User[]>(
      `${environment.apiURL}/${this.usersEndpoint}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getAllOrders(token: string) {
    return this.http.get<User[]>(
      `${environment.apiURL}/${this.ordersEndpoint}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getAllCouponCodes(token: string) {
    return this.http.get<Coupon[]>(
      `${environment.apiURL}/${this.couponsEndpoint}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getCoupon(code: string) {
    return this.http.get<Coupon>(
      `${environment.apiURL}/${this.couponsEndpoint}/${code}`
    );
  }

  uploadNewCoupon(formData: Coupon, token: string) {
    return this.http.post<Coupon>(
      `${environment.apiURL}/${this.couponsEndpoint}/`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  deleteCoupon(couponID: string, token: string) {
    return this.http.delete(
      `${environment.apiURL}/${this.couponsEndpoint}/${couponID}`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  getUserProfile(token: string) {
    return this.http.get<User>(
      `${environment.apiURL}/${this.usersEndpoint}/profile`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  createNewOrder(data) {
    return this.http.post(
      `${environment.apiURL}/${this.ordersEndpoint}/`,
      data
    );
  }

  markOrder(id: string, token: string) {
    return this.http.put(
      `${environment.apiURL}/${this.ordersEndpoint}/${id}/mark`,
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }

  deleteUnPaidOrder(id: string, token: string) {
    return this.http.delete(
      `${environment.apiURL}/${this.ordersEndpoint}/${id}/`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }
}
