import { Component, OnInit, Input } from '@angular/core';
import Product from 'src/app/model/Product';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() product: Product;
  apiEndpoint = environment.apiURL;
  hasOrder: boolean = false;
  quantity: number = 0;
  currency = environment.currency;

  constructor(private globalService: GlobalService) {}

  ngOnInit(): void {
    this.checkIfProductHasOrder(this.product._id);
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
