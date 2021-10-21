import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import User from 'src/app/model/User';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user = {
    name: '',
    phone: undefined,
    address: undefined,
    state: undefined,
    country: undefined,
    zipcode: undefined,
    image: undefined,
  };
  currentPassword = undefined;
  newPassword = undefined;

  constructor(
    private GlobalService: GlobalService,
    private apiService: APIService
  ) {
    document.title = 'Settings - Cards & Dice';
  }

  ngOnInit(): void {
    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService.getUserProfile(newToken).subscribe((data: User) => {
          this.user = {
            name: data.name,
            phone: data.phone,
            address: data.address,
            state: data.state,
            country: data.country,
            zipcode: data.zipcode,
            image: File,
          };
        });
      }
    });
  }

  changeProfileImage(event) {
    let file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      this.GlobalService.userToken.subscribe((newToken) => {
        if (newToken !== null) {
          this.apiService
            .updateUserProfilePhoto(formData, newToken)
            .subscribe((data: { message?: string }) => {
              alert(data.message);
            });
        }
      });
    }
  }

  changeProfile() {
    const formData = {
      name: this.user.name,
      phone: this.user.phone,
      address: this.user.address,
      state: this.user.state,
      country: this.user.country,
      zipcode: this.user.zipcode,
    };

    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .updateUserProfile(formData, newToken)
          .subscribe((data: { message: string }) => {
            alert(data.message);
          });
      }
    });
  }

  changePassword() {
    const formData = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };
    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .updateUserPassword(formData, newToken)
          .subscribe((data: { message: string }) => {
            alert(data.message);
          });
      }
    });
  }
}
