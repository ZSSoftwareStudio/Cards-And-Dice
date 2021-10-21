import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { CategoriesComponent } from './categories/categories.component';
import { SliderComponent } from './slider/slider.component';
import { SliderContentComponent } from './slider-content/slider-content.component';
import { SharedRoutingModule } from './shared-routing.module';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { AppGoogleSignInDirective } from './directives/app-google-sign-in.directive';
import { AppFacebookSignInDirective } from './directives/facebook-sign-in.directive';

const components = [
  NavbarComponent,
  CategoriesComponent,
  SliderComponent,
  SliderContentComponent,
  CardComponent,
  FooterComponent,
];

const directives = [AppGoogleSignInDirective, AppFacebookSignInDirective];

@NgModule({
  declarations: [...components, ...directives],
  imports: [CommonModule, SharedRoutingModule, FormsModule, SocialLoginModule],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleOAuthClientId),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              environment.facebookOAuthClientId
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  exports: [...components, ...directives],
})
export class SharedModule {}
