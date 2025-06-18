export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  featured?: boolean;
  inventory: number;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: Date;
}

// lib/types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithProducts extends Category {
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  // imageUrl: string;
  description: string;
  inStock: boolean;
  // createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  featured?: boolean;
  inventory: number;
  createdAt: string;
  sizes?: string[];
  colors?: string[];
  brand?: string;
  material?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: Date;
}
