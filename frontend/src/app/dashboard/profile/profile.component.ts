import { Component, OnInit } from '@angular/core';
import User from 'src/app/model/User';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: User;
  apiURL = environment.apiURL + '/';

  constructor(
    private GlobalService: GlobalService,
    private apiService: APIService
  ) {
    document.title = 'Your Profile - Cards & Dice';
  }

  ngOnInit(): void {
    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService.getUserProfile(newToken).subscribe((data: User) => {
          this.profile = data;
        });
      }
    });
  }
}
