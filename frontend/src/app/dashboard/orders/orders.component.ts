import { Component, OnInit } from '@angular/core';
import Product from 'src/app/model/Product';
import User from 'src/app/model/User';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  itemsLength: number = 0;
  totalPrice: number = 0;
  products = [];
  quantity = {};
  endPoint = environment.apiURL;
  currentUser: User;
  orders = [];
  allOrders = [];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  currentOrder = undefined;
  searchedOrder = '';
  currency = environment.currency;

  constructor(
    private GlobalService: GlobalService,
    private apiService: APIService
  ) {
    document.title = 'Your Orders - Cards & Dice';
  }

  ngOnInit(): void {
    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.currentUser = this.GlobalService.decodeJWT(newToken) as User;

        if (this.currentUser.role.toLowerCase() === 'user') {
          this.apiService.getOrders(newToken).subscribe((data) => {
            this.allOrders = data;
            this.orders = data;
          });
        } else {
          this.apiService.getAllOrders(newToken).subscribe((data) => {
            this.allOrders = data;
            this.orders = data;
          });
        }
      }
    });
  }

  formatDate(date: string) {
    const createdAt = new Date(date);
    var datestring =
      createdAt.getDate() +
      ' ' +
      this.months[createdAt.getMonth() + 1] +
      ', ' +
      createdAt.getFullYear();

    return datestring;
  }

  changeCurrentOrder(order) {
    if (order !== undefined) {
      const index = this.allOrders.indexOf(order);
      this.currentOrder = {
        ...order,
        index: index,
        products: JSON.parse(order.products),
      };
    } else {
      this.currentOrder = order;
    }

    if (this.currentOrder !== undefined) {
      let products = [];
      this.itemsLength = this.currentOrder.products.length;
      this.totalPrice = this.currentOrder.totalPrice;
      this.currentOrder.products.map((item) => {
        this.quantity[item.product] = item.quantity;
        this.apiService
          .getProduct(item.product)
          .subscribe((product: Product) => {
            products.push(product);
          });
      });

      this.products = products;
    }
  }

  toggleOrderMarking(order) {
    let orders = this.allOrders;
    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .markOrder(order.id, newToken)
          .subscribe((data: { message: string }) => {
            alert(data.message);
            let index = order.index;
            if (orders[index].status.toLowerCase() === 'incomplete') {
              orders[index] = {
                ...orders[index],
                status: 'complete',
              };
            } else {
              orders[index] = {
                ...orders[index],
                status: 'incomplete',
              };
            }

            this.allOrders = orders;
            this.orders = this.allOrders;

            setTimeout(() => {
              this.currentOrder = undefined;
            }, 1000);
          });
      }
    });
  }

  deleteUnpaidOrder(order: any) {
    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService.deleteUnPaidOrder(order.id, newToken).subscribe(() => {
          const index = this.allOrders.indexOf(order);
          this.allOrders.splice(index, 1);
          this.orders = this.allOrders;
          alert('Successfully Deleted this Order.');
        });
      }
    });
  }

  today() {
    return new Date();
  }

  getTodaysOrder(date) {
    const newData = this.allOrders.filter((item) => {
      const itemData = `
        ${this.formatDate(item.created_at).toUpperCase()}`;

      const textData = this.formatDate(date).toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.orders = newData;
  }

  searchFilterFunction(text) {
    const newData = this.allOrders.filter((item) => {
      const itemData = `${item.id}
        ${item.name.toUpperCase()}
        ${item.email.toUpperCase()}
        ${item.status.toUpperCase()}
        ${this.currency}
        ${item.totalPrice}
        ${this.formatDate(item.created_at).toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.orders = newData;
  }
}
