import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AboutComponent } from './Pages/about/about.component';
import { ProductsComponent } from './Pages/products/products.component';
import { SupportComponent } from './Pages/support/support.component';
import { FAQComponent } from './Pages/faq/faq.component';
import { ProductComponent } from './Pages/product/product.component';
import { AuthGuard } from './auth/auth.guard';
import { CartComponent } from './Pages/cart/cart.component';
import { OrderSuccessComponent } from './Pages/order-success/order-success.component';
import { LogoutComponent } from './dashboard/logout/logout.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: ProductsComponent },
  { path: 'category/:id', component: ProductsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'support', component: SupportComponent },
  { path: 'faq', component: FAQComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'order-failed', component: OrderSuccessComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
