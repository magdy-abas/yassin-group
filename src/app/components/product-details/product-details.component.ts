import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Product } from '../../../Dtos/productDto';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}

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

  // Method to navigate through product images
  nextImage() {
    if (this.product && this.product.images) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  prevImage() {
    if (this.product && this.product.images) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.product.images.length) %
        this.product.images.length;
    }
  }
}
