import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

// Firebase imports
import {
  Database,
  ref as dbRef,
  push,
  set,
  remove,
  get,
  child,
} from '@angular/fire/database';
import {
  Storage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Product, CreateProductDto } from '../../../../Dtos/productDto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private database = inject(Database);
  private storage = inject(Storage);
  private snackBar = inject(MatSnackBar);

  // Product Form
  productForm: FormGroup;

  // Products List
  products: Product[] = [];
  loading = true;

  // Image Handling
  mainImageFile: File | null = null;
  additionalImageFiles: File[] = [];

  // Categories
  categories: Array<'hookah-glass' | 'hookah'> = ['hookah-glass', 'hookah'];

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      height: ['', Validators.required],
      type: ['', Validators.required],
      price: [null],
      details: this.fb.group({
        brand: [''],
        color: [''],
        material: [''],
      }),
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  // Load Products
  async loadProducts() {
    try {
      this.loading = true;
      const productsRef = dbRef(this.database, 'products');
      const snapshot = await get(productsRef);

      if (snapshot.exists()) {
        this.products = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...(data as any),
        }));
      } else {
        this.products = [];
      }

      this.loading = false;
    } catch (error) {
      console.error('Error loading products:', error);
      this.loading = false;
      this.showSnackBar('Failed to load products');
    }
  }

  // Upload image to Firebase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const fileRef = storageRef(
        this.storage,
        `products/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(fileRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Image Handling
  onMainImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.mainImageFile = input.files[0];
    }
  }

  onAdditionalImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.additionalImageFiles = Array.from(input.files);
    }
  }

  // Submit Product
  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    try {
      // Upload main image
      let mainImgUrl = '';
      if (this.mainImageFile) {
        mainImgUrl = await this.uploadImage(this.mainImageFile);
      }

      // Upload additional images
      const additionalImgUrls = await Promise.all(
        this.additionalImageFiles.map((file) => this.uploadImage(file))
      );

      // Prepare product data
      const productData = {
        ...this.productForm.value,
        mainImg: mainImgUrl,
        images: [mainImgUrl, ...additionalImgUrls],
        createdAt: new Date().toISOString(),
      };

      // Add to Realtime Database
      const productsRef = dbRef(this.database, 'products');
      const newProductRef = push(productsRef);
      await set(newProductRef, productData);

      // Reset form and reload products
      this.productForm.reset();
      this.mainImageFile = null;
      this.additionalImageFiles = [];
      await this.loadProducts();

      this.showSnackBar('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      this.showSnackBar('Failed to add product');
    }
  }

  // Delete Product
  async deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const productRef = dbRef(this.database, `products/${productId}`);
        await remove(productRef);
        await this.loadProducts();
        this.showSnackBar('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        this.showSnackBar('Failed to delete product');
      }
    }
  }

  // Utility method to show snackbar
  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Convenience getter for form controls
  get f() {
    return this.productForm.controls;
  }
}
