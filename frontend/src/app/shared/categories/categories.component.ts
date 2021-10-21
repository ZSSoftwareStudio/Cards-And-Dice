import { Component, Input, OnInit } from '@angular/core';
import Category from 'src/app/model/Category';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @Input() categories: Category[];
  apiURL = environment.apiURL + '/';

  constructor() {}

  ngOnInit(): void {}
}
