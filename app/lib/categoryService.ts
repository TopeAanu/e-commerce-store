// lib/category-service.ts
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase/config"; // Adjust import path as needed

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class CategoryService {
  private readonly collectionName = "categories";

  async getAllCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, this.collectionName);
      const q = query(
        categoriesRef,
        where("isActive", "==", true),
        orderBy("name", "asc")
      );

      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          name: data.name,
          slug: data.slug,
          image: data.image,
          description: data.description,
          productCount: data.productCount || 0,
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);

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
        throw new Error(`Failed to fetch categories: ${error.message}`);
      }

      throw new Error(
        `Failed to fetch categories: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const categoriesRef = collection(db, this.collectionName);
      const q = query(
        categoriesRef,
        where("slug", "==", slug),
        where("isActive", "==", true),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        image: data.image,
        description: data.description,
        productCount: data.productCount || 0,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      throw new Error(
        `Failed to fetch category: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getFeaturedCategories(limitCount: number = 8): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, this.collectionName);
      const q = query(
        categoriesRef,
        where("isActive", "==", true),
        where("isFeatured", "==", true),
        orderBy("name", "asc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          name: data.name,
          slug: data.slug,
          image: data.image,
          description: data.description,
          productCount: data.productCount || 0,
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return categories;
    } catch (error) {
      console.error("Error fetching featured categories:", error);

      // Fallback to regular categories if featured query fails
      try {
        const categoriesRef = collection(db, this.collectionName);
        const fallbackQuery = query(
          categoriesRef,
          where("isActive", "==", true),
          orderBy("name", "asc"),
          limit(limitCount)
        );

        const fallbackSnapshot = await getDocs(fallbackQuery);
        const categories: Category[] = [];

        fallbackSnapshot.forEach((doc) => {
          const data = doc.data();
          categories.push({
            id: doc.id,
            name: data.name,
            slug: data.slug,
            image: data.image,
            description: data.description,
            productCount: data.productCount || 0,
            isActive: data.isActive,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          });
        });

        return categories;
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        throw new Error(
          `Failed to fetch categories: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  }

  // Utility method to create a slug from category name
  static createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
}

export const categoryService = new CategoryService();
