import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  {
    path: 'product/:id',
    component: ProductDetailsComponent,
  },
];
