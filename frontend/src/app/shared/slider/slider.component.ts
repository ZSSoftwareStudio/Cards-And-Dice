import { Component, Input, OnInit } from '@angular/core';
import Product from 'src/app/model/Product';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit {
  @Input() sliderProducts: Product[] = [];

  constructor() {}

  ngOnInit(): void {}
}
