import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { APIService } from 'src/app/services/api.service';

@Directive({
  selector: '[appFacebookSignIn]',
})
export class AppFacebookSignInDirective {
  constructor(
    private router: Router,
    private socialAuthService: SocialAuthService,
    private APIService: APIService
  ) {}

  @HostListener('click')
  onclick() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.APIService.authenticateUserWithSocialMedia({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.photoUrl,
        provider: user.provider,
        role: 'User',
      }).subscribe((data: { access_token: string; message: string }) => {
        localStorage.setItem('access_token', data.access_token);
        this.router.navigateByUrl('/dashboard');
      });
    });
  }
}
