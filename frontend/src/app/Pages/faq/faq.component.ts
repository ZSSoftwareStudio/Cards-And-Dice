import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FAQComponent implements OnInit {
  constructor() {
    document.title = 'Frequently Asked Questions - Cards & Dice';
  }

  ngOnInit(): void {}
}
