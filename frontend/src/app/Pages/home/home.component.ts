import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import Product from 'src/app/model/Product';
import Category from 'src/app/model/Category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[];
  sliderProducts: Product[];
  categories: Category[];
  loading: boolean = true;

  constructor(private apiService: APIService) {
    document.title = 'Home - Cards & Dice';

    this.apiService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  ngOnInit(): void {
    this.apiService.getProducts().subscribe((data: Product[]) => {
      this.products = data.slice(0, 8);
      this.sliderProducts = data.slice(0, 4);
      this.loading = false;
    });
  }
}
