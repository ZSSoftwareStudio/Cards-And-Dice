import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { UsersComponent } from './users/users.component';
import { CouponsComponent } from './coupons/coupons.component';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardHomeComponent,
    OrdersComponent,
    ProfileComponent,
    SettingsComponent,
    ProductsComponent,
    CategoriesComponent,
    UsersComponent,
    CouponsComponent,
    LogoutComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, FormsModule],
  bootstrap: [DashboardComponent],
  entryComponents: [DashboardComponent],
})
export class DashboardModule {}
