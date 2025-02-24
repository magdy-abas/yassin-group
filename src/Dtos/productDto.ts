// src/app/Dtos/productDto.ts

// Interface for translated content
export interface TranslatedContent {
  name: string;
  description: string;
  type: string;
  details?: {
    brand?: string;
    color?: string;
    material?: string;
  };
}

// Interface for translations object
export interface Translations {
  en: TranslatedContent;
  ar: TranslatedContent;
}

// Main Product interface
export interface Product {
  id?: string;
  translations: {
    en: {
      name: string;
      description: string;
      type: string;
      details?: {
        brand?: string;
        color?: string;
        material?: string;
      };
    };
    ar: {
      name: string;
      description: string;
      type: string;
      details?: {
        brand?: string;
        color?: string;
        material?: string;
      };
    };
  };
  category: 'hookah-glass' | 'hookah';
  mainImg: string;
  height: string;
  price?: number;
  featured?: boolean;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}
// Interface for creating a new product (without ID)
export interface CreateProductDto
  extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

// Interface for updating an existing product
export interface UpdateProductDto
  extends Partial<Omit<Product, 'id' | 'createdAt'>> {
  updatedAt?: string;
}
