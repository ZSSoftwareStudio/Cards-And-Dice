import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
})
export class OrderSuccessComponent implements OnInit {
  id = undefined;

  constructor(
    private GlobalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.orderId && params.orderId !== '') {
        this.GlobalService._orders = null;
        this.id = params.orderId;
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }
}
