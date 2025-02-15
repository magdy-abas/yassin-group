// src/app/Dtos/productDto.ts
export interface Product {
  id?: string;
  name: string;
  category: 'hookah-glass' | 'hookah';
  mainImg: string;
  description: string;
  height: string;
  type: string;
  price?: number;
  images: string[];
  createdAt?: string;
  details?: {
    brand?: string;
    color?: string;
    material?: string;
  };
}

// Interface for creating a new product (without ID)
export interface CreateProductDto extends Omit<Product, 'id' | 'createdAt'> {
  id?: string;
}
