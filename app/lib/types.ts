// lib/types/index.ts (or wherever your types are)

// Single Product interface with all properties
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId?: string;
  imageUrl?: string;
  featured?: boolean;
  inventory: number;
  inStock?: boolean;
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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Add this line
}
