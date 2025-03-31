import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatSnackBarModule,
  MatSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  Database,
  ref as dbRef,
  push,
  set,
  remove,
  get,
  update,
} from '@angular/fire/database';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { TranslationService } from '../../../services/translation.service';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from './../../../../Dtos/productDto';
import { AuthService } from '../../../services/auth.service';

interface ProductFormData {
  name: string;
  nameAr: string;
  category: 'hookah-glass' | 'hookah';
  description: string;
  descriptionAr: string;
  height: string;
  type: string;
  typeAr: string;
  price: number | null;
  details: {
    brand: string | null;
    brandAr: string | null;
    color: string | null;
    colorAr: string | null;
    material: string | null;
    materialAr: string | null;
  };
}

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
    MatDialogModule,
  ],
  providers: [
    {
      provide: MatSnackBarConfig,
      useValue: {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      } as MatSnackBarConfig,
    },
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private database = inject(Database);
  private storage = inject(Storage);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private translationService = inject(TranslationService);

  productForm!: FormGroup;
  isSubmitting = false;
  isEditing = false;
  currentEditId: string | null = null;
  products: Product[] = [];
  loading = true;
  mainImageFile: File | null = null;
  additionalImageFiles: File[] = [];
  existingImages: string[] = [];
  categories: Array<'hookah-glass' | 'hookah'> = ['hookah-glass', 'hookah'];

  constructor(private authService: AuthService) {
    this.initializeForm();
  }

  logout(): void {
    this.authService.logout();
  }

  private initializeForm(product?: Product) {
    this.productForm = this.fb.group({
      name: [
        product?.translations?.en?.name || '',
        [Validators.required, Validators.minLength(3)],
      ],
      nameAr: [
        product?.translations?.ar?.name || '',
        [Validators.required, Validators.minLength(3)],
      ],
      category: [product?.category || '', Validators.required],
      description: [
        product?.translations?.en?.description || '',
        [Validators.required, Validators.minLength(10)],
      ],
      descriptionAr: [
        product?.translations?.ar?.description || '',
        [Validators.required, Validators.minLength(10)],
      ],
      height: [product?.height || '', Validators.required],
      type: [product?.translations?.en?.type || '', Validators.required],
      typeAr: [product?.translations?.ar?.type || '', Validators.required],
      price: [product?.price || null],
      details: this.fb.group({
        brand: [product?.translations?.en?.details?.brand || ''],
        brandAr: [product?.translations?.ar?.details?.brand || ''],
        color: [product?.translations?.en?.details?.color || ''],
        colorAr: [product?.translations?.ar?.details?.color || ''],
        material: [product?.translations?.en?.details?.material || ''],
        materialAr: [product?.translations?.ar?.details?.material || ''],
      }),
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    const productsRef = dbRef(this.database, 'products');
    const snapshot = await get(productsRef);

    if (snapshot.exists()) {
      this.products = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...(data as Omit<Product, 'id'>),
      }));
    } else {
      this.products = [];
    }
    this.loading = false;
  }

  async uploadImage(file: File): Promise<string> {
    const startTime = performance.now();
    const fileRef = ref(this.storage, `products/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    console.log(`Image upload took ${performance.now() - startTime}ms`);
    return url;
  }

  async deleteImage(imageUrl: string) {
    const startTime = performance.now();
    const imageRef = ref(this.storage, imageUrl);
    await deleteObject(imageRef);
    console.log(`Image delete took ${performance.now() - startTime}ms`);
  }

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

  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue: ProductFormData = this.productForm.value;

    let mainImgUrl = this.isEditing ? this.existingImages[0] || '' : '';
    const newImageUrls: string[] = [];

    if (this.mainImageFile) {
      mainImgUrl = await this.uploadImage(this.mainImageFile);
      newImageUrls.push(mainImgUrl);
    }

    if (this.additionalImageFiles.length > 0) {
      const additionalUrls = await Promise.all(
        this.additionalImageFiles.map((file) => this.uploadImage(file))
      );
      newImageUrls.push(...additionalUrls);
    }

    const cleanDetails = (details: any) => {
      const cleaned: any = {};
      Object.keys(details).forEach((key) => {
        if (details[key]) {
          cleaned[key] = details[key];
        }
      });
      return Object.keys(cleaned).length > 0 ? cleaned : null;
    };

    const productData = {
      translations: {
        en: {
          name: formValue.name,
          description: formValue.description,
          type: formValue.type,
          details: cleanDetails({
            brand: formValue.details.brand || null,
            color: formValue.details.color || null,
            material: formValue.details.material || null,
          }),
        },
        ar: {
          name: formValue.nameAr,
          description: formValue.descriptionAr,
          type: formValue.typeAr,
          details: cleanDetails({
            brand: formValue.details.brandAr || null,
            color: formValue.details.colorAr || null,
            material: formValue.details.materialAr || null,
          }),
        },
      },
      category: formValue.category,
      height: formValue.height,
      price: formValue.price || null,
      mainImg: mainImgUrl,
      images: [
        ...(this.isEditing
          ? this.existingImages.filter((url) => url !== this.existingImages[0])
          : []),
        ...newImageUrls,
      ],
    };

    const timestamp = new Date().toISOString();

    if (!this.isEditing) {
      const productsRef = dbRef(this.database, 'products');
      const newProductRef = push(productsRef);
      await set(newProductRef, {
        ...productData,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      this.showSnackBar('Product added successfully');
    } else if (this.currentEditId) {
      const startTime = performance.now();
      const productRef = dbRef(this.database, `products/${this.currentEditId}`);
      await update(productRef, {
        ...productData,
        updatedAt: timestamp,
      });
      console.log(`Database update took ${performance.now() - startTime}ms`);
      this.showSnackBar('Product updated successfully');
    }

    this.resetForm();
    this.updateLocalProduct();
    this.isSubmitting = false;
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.currentEditId = product.id || null;
    this.existingImages = product.images || [];
    this.initializeForm(product);
  }
  async deleteProduct(productId: string) {
    if (!this.authService.isAdminLoggedIn()) {
      this.showSnackBar('You must be logged in as admin to delete products');
      return;
    }

    const isConfirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    );

    if (isConfirmed) {
      try {
        const productRef = dbRef(this.database, `products/${productId}`);
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          const product = snapshot.val() as Product;
          if (product.images && Array.isArray(product.images)) {
            await Promise.all(
              product.images.map(async (imageUrl: string) => {
                try {
                  await this.deleteImage(imageUrl);
                  console.log(`Deleted image: ${imageUrl}`);
                } catch (error) {
                  console.warn(`Failed to delete image ${imageUrl}:`, error);
                }
              })
            );
          }
        }

        await remove(productRef);
        this.products = this.products.filter((p) => p.id !== productId);
        this.showSnackBar('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        this.showSnackBar(
          'Failed to delete product. Check permissions or console.'
        );
      }
    } else {
      this.showSnackBar('Deletion canceled');
    }
  }

  resetForm() {
    this.isEditing = false;
    this.currentEditId = null;
    this.existingImages = [];
    this.mainImageFile = null;
    this.additionalImageFiles = [];
    this.initializeForm();
    this.productForm.markAsPristine();
    this.productForm.markAsUntouched();
  }

  removeExistingImage(imageUrl: string) {
    this.existingImages = this.existingImages.filter((url) => url !== imageUrl);
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close');
  }

  private updateLocalProduct() {
    if (this.currentEditId) {
      const index = this.products.findIndex((p) => p.id === this.currentEditId);
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          ...this.productForm.value,
          updatedAt: new Date().toISOString(),
        };
      }
    }
  }

  get f() {
    return this.productForm.controls;
  }
}
