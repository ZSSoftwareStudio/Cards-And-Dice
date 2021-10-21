import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Product from 'src/app/model/Product';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  loading: boolean = true;
  product: Product;
  apiURL: string = environment.apiURL;
  hasOrder: boolean = false;
  quantity: number = 0;
  currency = environment.currency;

  constructor(
    private route: ActivatedRoute,
    private apiService: APIService,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((routeParams) => {
      if (routeParams !== undefined) {
        this.apiService
          .getProduct(routeParams.id)
          .subscribe((data: Product) => {
            this.product = data;
            document.title = data.title + ' - Cards & Dice';
            this.checkIfProductHasOrder(routeParams.id);

            setTimeout(() => {
              this.loading = false;
            }, 500);
          });
      }
    });
  }

  addToCart(product: Product) {
    this.globalService.addOrder(product, 1);
  }

  decrementProductQuantity(product: Product) {
    this.globalService.decrementProductQuantity(product, 1);
  }

  getProduct(product: string) {
    this.globalService.orders.subscribe((orders) => {
      let products = orders.products;

      const currentProduct = products.find((item) => item.product == product);
      if (currentProduct !== undefined) {
        this.quantity = currentProduct.quantity;
      }
    });
  }

  checkIfProductHasOrder(product: string) {
    this.globalService.orders.subscribe((order) => {
      let currentProduct = order.products.find(
        (item) => item.product == product
      );

      if (currentProduct !== undefined) {
        this.hasOrder = true;
        this.getProduct(product);
      }
    });
  }
}
