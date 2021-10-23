import { Component, OnInit } from '@angular/core';
import Coupon from 'src/app/model/Coupon';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
})
export class CouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  newCoupon: Coupon;
  loading: boolean = true;
  apiURL = environment.apiURL;

  constructor(
    private globalService: GlobalService,
    private apiService: APIService
  ) {
    document.title = 'Manage Coupon Codes - Cards & Dice';
  }

  ngOnInit(): void {
    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .getAllCouponCodes(newToken)
          .subscribe((data: Coupon[]) => {
            this.coupons = data;
            setTimeout(() => {
              this.loading = false;
            }, 500);
          });
      }
    });
  }

  addCoupon() {
    this.newCoupon = {
      code: '',
      discount: 0,
    };
  }

  hideCoupon() {
    this.newCoupon = undefined;
  }

  uploadNewCouponToServer() {
    const formData = this.newCoupon;

    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .uploadNewCoupon(formData, newToken)
          .subscribe((data: Coupon) => {
            this.coupons.push(data);
            alert('Successfully Uploaded new Coupon.');
            setTimeout(() => {
              this.hideCoupon();
            }, 2000);
          });
      }
    });
  }

  deleteCurrentCoupon(coupon: Coupon) {
    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService.deleteCoupon(coupon.id, newToken).subscribe(() => {
          const index = this.coupons.indexOf(coupon);
          this.coupons.splice(index, 1);
          alert('Successfully Deleted this Coupon.');
          setTimeout(() => {
            this.hideCoupon();
          }, 2000);
        });
      }
    });
  }
}
