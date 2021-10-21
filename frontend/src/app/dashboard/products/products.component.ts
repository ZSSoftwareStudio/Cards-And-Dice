import { Component, OnInit } from '@angular/core';
import Category from 'src/app/model/Category';
import Product from 'src/app/model/Product';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  newProduct = undefined;
  currentProduct: Product;
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: Category[] = [];
  loading: boolean = true;
  apiURL = environment.apiURL;
  currency = environment.currency;
  searchedProduct = '';

  constructor(
    private apiService: APIService,
    private globalService: GlobalService
  ) {
    document.title = 'Manage Products - Cards & Dice';
  }

  ngOnInit(): void {
    this.apiService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
      this.apiService.getProducts().subscribe((data: Product[]) => {
        this.products = data;
        this.allProducts = data;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    });
  }

  manageProduct(product: Product) {
    this.currentProduct = product;
    this.newProduct = undefined;
    window.scrollTo(0, 0);
  }

  changeProductImage(event, product: Product) {
    let file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      this.globalService.userToken.subscribe((newToken) => {
        if (newToken !== null) {
          this.apiService
            .uploadNewProductImage(formData, newToken, product._id)
            .subscribe((data: Product) => {
              const index = this.allProducts.indexOf(product);
              this.allProducts[index] = data;
              this.products = this.allProducts;
              alert('Successfully changed to the new Image.');
            });
        }
      });
    }
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      this.newProduct.image = file;
    }
  }

  uploadNewProductToServer() {
    const formData = new FormData();
    formData.append('title', this.newProduct.title);
    formData.append('price', this.newProduct.price);
    formData.append('category', this.newProduct.category);
    formData.append('description', this.newProduct.description);
    formData.append('image', this.newProduct.image);

    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .uploadProduct(formData, newToken)
          .subscribe((data: Product) => {
            this.allProducts.push(data);
            this.products = this.allProducts;
            alert('Successfully Uploaded new Product.');
            setTimeout(() => {
              this.hideProduct();
            }, 2000);
          });
      }
    });
  }

  updateCurrentProduct() {
    const formData = this.currentProduct;

    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .updateProduct(formData, this.currentProduct._id, newToken)
          .subscribe((data: Product) => {
            const index = this.allProducts.indexOf(this.currentProduct);
            this.allProducts[index] = data;
            this.products = this.allProducts;
            alert('Successfully Updated this Product.');
            setTimeout(() => {
              this.hideProduct();
            }, 2000);
          });
      }
    });
  }

  deleteCurrentProduct(product: Product) {
    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService.deleteProduct(product._id, newToken).subscribe(() => {
          const index = this.allProducts.indexOf(this.currentProduct);
          this.allProducts.splice(index, 1);
          this.products = this.allProducts;
          alert('Successfully Deleted this Product.');
          setTimeout(() => {
            this.hideProduct();
          }, 2000);
        });
      }
    });
  }

  hideProduct() {
    this.currentProduct = undefined;
    this.newProduct = undefined;
  }

  addProduct() {
    this.currentProduct = undefined;
    this.newProduct = {
      title: '',
      price: 0,
      category: '',
      description: '',
      image: File,
    };
  }

  searchFilterFunction(text) {
    const newData = this.allProducts.filter((item) => {
      const itemData = `${item.title.toUpperCase()}${this.currency}${
        item.price
      }`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.products = newData;
  }

  sortProductsBasedOnPrice(sortingOrder: String) {
    if (sortingOrder === 'ASC') {
      this.products = this.allProducts.sort((a, b) =>
        a.price > b.price ? 1 : -1
      );
    } else {
      this.products = this.allProducts.sort((a, b) =>
        a.price < b.price ? 1 : -1
      );
    }
  }
}
