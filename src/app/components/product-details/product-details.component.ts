import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Product } from '../../../Dtos/productDto';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../navbar/navbar.component';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NavbarComponent,
    RouterLink,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  currentImageIndex = 0;
  TranslationService = inject(TranslationService);
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}
  currentLang(): 'en' | 'ar' {
    return this.TranslationService.getCurrentLanguage() as 'en' | 'ar';
  }

  // Add this to your component class
  getProductDetails(field: 'brand' | 'color' | 'material'): string | undefined {
    return this.product?.translations[this.currentLang()]?.details?.[field];
  }

  hasDetails(): boolean {
    return !!this.product?.translations[this.currentLang()]?.details;
  }
  ngOnInit() {
    // Get the product ID from the route parameter
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.fetchProductDetails(productId);
    } else {
      this.error = 'No product ID provided';
      this.loading = false;
    }
  }

  async fetchProductDetails(productId: string) {
    try {
      this.product = await this.firebaseService.getProductById(productId);
      this.loading = false;
    } catch (error: any) {
      console.error('Error fetching product details:', error);
      this.error = error.message || 'Failed to load product details';
      this.loading = false;
    }
  }

  displayImages(): string[] {
    return this.product?.images && this.product.images.length > 0
      ? this.product.images
      : ([this.product?.mainImg].filter(Boolean) as string[]);
  }

  nextImage() {
    const images = this.displayImages();
    if (images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
    }
  }

  prevImage() {
    const images = this.displayImages();
    if (images.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + images.length) % images.length;
    }
  }
}
