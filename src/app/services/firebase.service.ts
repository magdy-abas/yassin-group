import { Injectable, inject } from '@angular/core';
import {
  Database,
  ref as dbRef,
  set,
  push,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  orderByKey,
  startAfter,
} from '@angular/fire/database';

import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

import { Product, CreateProductDto } from './../../Dtos/productDto';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private database: Database = inject(Database);
  private storage: Storage = inject(Storage);

  // Upload image to Firebase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const storageRef = ref(
        this.storage,
        `products/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Delete image
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(this.storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Create a new product
  async createProduct(productData: CreateProductDto): Promise<string> {
    try {
      const productsRef = dbRef(this.database, 'products');
      const newProductRef = push(productsRef);
      await set(newProductRef, {
        ...productData,
        createdAt: new Date().toLocaleString(),
      });
      return newProductRef.key!;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(
    productId: string,
    productData: Partial<Product>
  ): Promise<void> {
    try {
      const updates: { [key: string]: any } = {};
      updates[`/products/${productId}`] = productData;
      await update(dbRef(this.database), updates);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    try {
      await remove(dbRef(this.database, `products/${productId}`));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const snapshot = await get(dbRef(this.database, 'products'));
      const products: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        } as Product);
      });
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(
    category: 'hookah-glass' | 'glass'
  ): Promise<Product[]> {
    try {
      const productsRef = dbRef(this.database, 'products');
      const categoryQuery = query(
        productsRef,
        orderByChild('category'),
        equalTo(category)
      );
      const snapshot = await get(categoryQuery);
      const products: Product[] = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        } as Product);
      });
      return products;
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const snapshot = await get(dbRef(this.database, `products/${productId}`));
      if (snapshot.exists()) {
        return {
          id: snapshot.key,
          ...snapshot.val(),
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  }

  async getProductsPaginated(
    pageSize: number = 8,
    lastKey: string | null = null
  ): Promise<{ products: Product[]; lastKey: string | null }> {
    try {
      let productsQuery;
      if (lastKey) {
        productsQuery = query(
          dbRef(this.database, 'products'),
          orderByKey(),
          startAfter(lastKey),
          limitToFirst(pageSize)
        );
      } else {
        productsQuery = query(
          dbRef(this.database, 'products'),
          orderByKey(),
          limitToFirst(pageSize)
        );
      }

      const snapshot = await get(productsQuery);
      const products: Product[] = [];
      let newLastKey: string | null = null;

      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        } as Product);
        newLastKey = childSnapshot.key;
      });

      return {
        products,
        lastKey: newLastKey,
      };
    } catch (error) {
      console.error('Error getting paginated products:', error);
      throw error;
    }
  }
}
