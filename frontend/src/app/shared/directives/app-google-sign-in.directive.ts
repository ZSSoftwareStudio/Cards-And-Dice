import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { APIService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';

@Directive({
  selector: '[appGoogleSignIn]',
})
export class AppGoogleSignInDirective {
  constructor(
    private router: Router,
    private socialAuthService: SocialAuthService,
    private APIService: APIService,
    private GlobalService: GlobalService
  ) {}

  @HostListener('click')
  onclick() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe((user) => {
      this.APIService.authenticateUserWithSocialMedia({
        _id: user.id,
        name: user.name,
        email: user.email,
        image: user.photoUrl,
        provider: user.provider,
        role: 'User',
      }).subscribe((data: { access_token: string; message: string }) => {
        this.GlobalService.access_token = data.access_token;
        this.router.navigateByUrl('/dashboard');
      });
    });
  }
}
