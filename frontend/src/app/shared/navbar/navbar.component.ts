import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import User from 'src/app/model/User';
import { environment } from 'src/environments/environment';
import Order from 'src/app/model/Order';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  currentUser: User;
  searchTerm: string;
  email: string;
  password: string;
  order: Order;
  apiURL = environment.apiURL + '/';

  constructor(
    private router: Router,
    private APIService: APIService,
    private GlobalService: GlobalService
  ) {
    this.GlobalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.loggedIn = true;
        this.APIService.getUserProfile(newToken).subscribe((data: User) => {
          this.currentUser = data;
        });
      } else {
        this.loggedIn = false;
      }
    });
  }

  ngOnInit(): void {
    this.GlobalService.orders.subscribe((order: Order) => {
      this.order = order;
    });
  }

  onSubmit() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
    this.searchTerm = '';
  }

  authenticateUserWithEmail() {
    this.APIService.authenticateUserWithEmailAndPassword({
      email: this.email,
      password: this.password,
    }).subscribe((data: { access_token: string; message: string }) => {
      this.GlobalService.access_token = data.access_token;

      this.router.navigateByUrl('/dashboard');
    });
  }
}
