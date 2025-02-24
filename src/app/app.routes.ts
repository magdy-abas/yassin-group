import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { authGuard } from './guards/auth.guard';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'products', component: ProductsComponent },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
  },
];
