import { Component, Input, OnInit } from '@angular/core';
import Product from 'src/app/model/Product';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-slider-content',
  templateUrl: './slider-content.component.html',
  styleUrls: ['./slider-content.component.scss'],
})
export class SliderContentComponent implements OnInit {
  @Input() product: Product;
  apiEndpoint = environment.apiURL;

  constructor() {}

  ngOnInit(): void {}
}
