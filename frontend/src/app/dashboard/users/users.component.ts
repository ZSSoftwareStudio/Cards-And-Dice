import { Component, OnInit } from '@angular/core';
import User from 'src/app/model/User';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  newUser = undefined;
  users: User[] = [];
  allUsers: User[] = [];
  currentUser: User;
  profile: User;
  loading: boolean = true;
  apiURL = environment.apiURL;
  searchedUser = '';

  constructor(
    private apiService: APIService,
    private globalService: GlobalService
  ) {
    document.title = 'Manage Users - Cards & Dice';
  }

  ngOnInit(): void {
    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.profile = this.globalService.decodeJWT(newToken) as User;
        this.apiService.getAllUsers(newToken).subscribe((data: User[]) => {
          this.users = data;
          this.allUsers = data;
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
      }
    });
  }

  manageUser(user: User) {
    this.currentUser = user;
    window.scrollTo(0, 0);
  }

  hideUser() {
    this.currentUser = undefined;
    this.newUser = undefined;
    window.scrollTo(0, 0);
  }

  addUser() {
    this.currentUser = undefined;
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'user',
    };
  }

  changeUserRole(event, user: any) {
    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .changeUserRole(user._id, newToken, event.target.value)
          .subscribe((data: { message: string }) => {
            const index = this.users.indexOf(user);
            this.allUsers[index] = {
              ...this.allUsers[index],
              role: event.target.value,
            };
            this.users = this.allUsers;
            alert(data.message);
            this.currentUser = undefined;
          });
      }
    });
  }

  createNewUser() {
    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.apiService
          .registerNewUser(this.newUser, newToken)
          .subscribe((data: User) => {
            this.allUsers.push(data);
            this.users = this.allUsers;
            alert('Successfully Created new User');
            setTimeout(() => {
              this.hideUser();
            }, 2000);
          });
      }
    });
  }

  searchFilterFunction(text) {
    const newData = this.allUsers.filter((item) => {
      const itemData = `${item.name.toUpperCase()}${item.email
        .split('@')[0]
        .toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.users = newData;
  }

  showUsersBasedOnRole(text: string) {
    const newData = this.allUsers.filter((item) => {
      const itemData = `${item.role.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.users = newData;
  }
}
