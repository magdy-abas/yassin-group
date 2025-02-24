import { Component, OnInit, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FirebaseService } from '../../services/firebase.service';
import { Product } from '../../../Dtos/productDto';
import { TranslationService } from './../../services/translation.service';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HeroSectionComponent, NavbarComponent, RouterLink],

  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  TranslationService = inject(TranslationService);
  products: Product[] = [];
  loading = true;
  error = '';
  lastKey: string | null = null;
  allProductsLoaded = false;
  isLoadingMore = false; // New flag to differentiate initial and subsequent loading

  constructor(
    private firebaseService: FirebaseService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadInitialProducts();
    this.setupInfiniteScroll();
  }
  currentLang(): 'en' | 'ar' {
    return this.TranslationService.getCurrentLanguage() as 'en' | 'ar';
  }
  setupInfiniteScroll() {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onWindowScroll.bind(this));
    });
  }

  onWindowScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      this.ngZone.run(() => {
        this.loadMoreProducts();
      });
    }
  };

  async loadInitialProducts() {
    try {
      this.loading = true;
      const result = await this.firebaseService.getProductsPaginated();
      this.products = result.products;
      this.lastKey = result.lastKey;

      // Determine if all products are loaded
      this.allProductsLoaded = result.products.length < 8;

      this.loading = false;
    } catch (error: any) {
      console.error('Error loading initial products:', error);
      this.error = error.message;
      this.loading = false;
    }
  }

  async loadMoreProducts() {
    // Prevent multiple simultaneous loading attempts
    if (this.loading || this.isLoadingMore || this.allProductsLoaded) return;

    try {
      this.isLoadingMore = true;
      const result = await this.firebaseService.getProductsPaginated(
        8,
        this.lastKey
      );

      if (result.products.length === 0) {
        this.allProductsLoaded = true;
        this.isLoadingMore = false;
        return;
      }

      this.products = [...this.products, ...result.products];
      this.lastKey = result.lastKey;

      // Check if this is the last batch of products
      if (result.products.length < 8) {
        this.allProductsLoaded = true;
      }

      this.isLoadingMore = false;
    } catch (error: any) {
      console.error('Error loading more products:', error);
      this.error = error.message;
      this.isLoadingMore = false;
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }
}
