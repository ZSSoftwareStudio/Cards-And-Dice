import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { APIService } from 'src/app/services/api.service';
import Product from 'src/app/model/Product';
import Category from 'src/app/model/Category';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[];
  loading: boolean = true;
  search: boolean = false;
  searchTerm: string;

  constructor(private route: ActivatedRoute, private apiService: APIService) {
    document.title = 'All Products - Cards & Dice';

    this.apiService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(map((id) => id)).subscribe((param) => {
      const categoryId = param.id;
      if (categoryId === undefined) {
        this.apiService.getProducts().subscribe((data: Product[]) => {
          this.products = data;
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
      } else {
        this.loading = true;
        this.apiService.getProducts().subscribe((data: Product[]) => {
          this.products = data.filter(
            (product) => product.category._id === categoryId
          );
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params.q && params.q !== '') {
        this.loading = true;
        this.search = true;
        this.searchTerm = params.q;
        document.title = 'Search: ' + this.searchTerm + ' - Cards & Dice';
        this.apiService.getProducts().subscribe((data: Product[]) => {
          this.products = data.filter((product) =>
            product.title.includes(params.q)
          );
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
      } else {
        this.search = false;
      }
    });
  }
}
