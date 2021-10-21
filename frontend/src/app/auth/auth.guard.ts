import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  loggedIn = false;
  constructor(private globalService: GlobalService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.globalService.userToken.subscribe((newToken) => {
      if (newToken !== null) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
    return this.loggedIn;
  }
}
