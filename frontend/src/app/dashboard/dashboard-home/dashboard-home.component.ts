import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import User from 'src/app/model/User';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  currentUser: User;
  loggedIn: boolean = false;
  apiURL = environment.apiURL + '/';

  constructor(
    private router: Router,
    private GlobalService: GlobalService,
    private apiService: APIService
  ) {}

  ngOnInit(): void {
    document.title = `Dashboard - Cards & Dice`;
    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.loggedIn = true;
        this.apiService.getUserProfile(newToken).subscribe((data: User) => {
          this.currentUser = data;
        });
      } else {
        this.loggedIn = false;
      }
    });
  }
}
