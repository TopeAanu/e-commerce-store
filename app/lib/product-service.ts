// lib/product-service.ts
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase/config"; // Adjust import path as needed

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryId?: string;
  image: string;
  description?: string;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

class ProductService {
  private readonly collectionName = "products";

  async getAllProducts(): Promise<Product[]> {
    try {
      const productsRef = collection(db, this.collectionName);
      const q = query(
        productsRef,
        where("isActive", "==", true),
        orderBy("name", "asc")
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category,
          categoryId: data.categoryId,
          image: data.image,
          description: data.description,
          stock: data.stock || 0,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return products;
    } catch (error) {
      console.error("Error fetching products:", error);

      if (error instanceof FirestoreError) {
        if (error.code === "unavailable") {
          throw new Error(
            "Service temporarily unavailable. Please check your internet connection and try again."
          );
        } else if (error.code === "permission-denied") {
          throw new Error(
            "Permission denied. Please check your access rights."
          );
        }
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      throw new Error(
        `Failed to fetch products: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, this.collectionName);
      const q = query(
        productsRef,
        where("isActive", "==", true),
        where("category", "==", categoryName),
        orderBy("name", "asc")
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category,
          categoryId: data.categoryId,
          image: data.image,
          description: data.description,
          stock: data.stock || 0,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return products;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw new Error(
        `Failed to fetch products: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // For better search, consider using Algolia or similar
      const productsRef = collection(db, this.collectionName);
      const q = query(
        productsRef,
        where("isActive", "==", true),
        orderBy("name", "asc")
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const product = {
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category,
          categoryId: data.categoryId,
          image: data.image,
          description: data.description,
          stock: data.stock || 0,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };

        // Client-side filtering for search
        const searchLower = searchTerm.toLowerCase();
        if (
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.tags?.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          )
        ) {
          products.push(product);
        }
      });

      return products;
    } catch (error) {
      console.error("Error searching products:", error);
      throw new Error(
        `Failed to search products: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
    try {
      const productsRef = collection(db, this.collectionName);
      const q = query(
        productsRef,
        where("isActive", "==", true),
        where("isFeatured", "==", true),
        orderBy("name", "asc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          price: data.price,
          category: data.category,
          categoryId: data.categoryId,
          image: data.image,
          description: data.description,
          stock: data.stock || 0,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return products;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw new Error(
        `Failed to fetch featured products: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export const productService = new ProductService();
