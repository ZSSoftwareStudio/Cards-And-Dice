import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './Pages/home/home.component';
import { AboutComponent } from './Pages/about/about.component';
import { ProductsComponent } from './Pages/products/products.component';
import { FAQComponent } from './Pages/faq/faq.component';
import { SupportComponent } from './Pages/support/support.component';
import { APIService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './Pages/product/product.component';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CartComponent } from './Pages/cart/cart.component';
import { FormsModule } from '@angular/forms';
import { OrderSuccessComponent } from './Pages/order-success/order-success.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ProductsComponent,
    FAQComponent,
    SupportComponent,
    ProductComponent,
    CartComponent,
    OrderSuccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    LoadingBarRouterModule,
    FormsModule,
  ],
  providers: [APIService],
  bootstrap: [AppComponent],
})
export class AppModule {}
