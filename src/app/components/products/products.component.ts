import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Database, ref, get, child } from '@angular/fire/database';
import { Product } from './../../../Dtos/productDto';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    NavbarComponent,
    RouterLink,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private database: Database = inject(Database);
  products: Product[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.getProducts();
  }

  async getProducts() {
    try {
      console.log('Starting to fetch products...');
      const dbRef = ref(this.database);
      const snapshot = await get(child(dbRef, 'products'));

      if (snapshot.exists()) {
        this.products = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...(data as any),
        }));
      } else {
        this.products = [];
      }

      console.log('Final processed products:', this.products);
      this.loading = false;
    } catch (error: any) {
      console.error('Error loading products:', error);
      this.error = error.message;
      this.loading = false;
    }
  }
}
