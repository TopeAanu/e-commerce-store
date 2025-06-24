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
  isFeatured?: boolean;
  parentId?: string | null;
  level?: number;
  children?: string[];
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
          isFeatured: data.isFeatured,
          parentId: data.parentId || null,
          level: data.level || 0,
          children: data.children || [],
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

      const docSnapshot = querySnapshot.docs[0];
      const data = docSnapshot.data();

      return {
        id: docSnapshot.id,
        name: data.name,
        slug: data.slug,
        image: data.image,
        description: data.description,
        productCount: data.productCount || 0,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        parentId: data.parentId || null,
        level: data.level || 0,
        children: data.children || [],
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

  async getCategoriesByIds(categoryIds: string[]): Promise<Category[]> {
    try {
      if (!categoryIds || categoryIds.length === 0) {
        return [];
      }

      const categories: Category[] = [];

      // Firebase doesn't support "in" queries with more than 10 items
      // So we'll batch the requests if needed
      const batchSize = 10;
      for (let i = 0; i < categoryIds.length; i += batchSize) {
        const batch = categoryIds.slice(i, i + batchSize);

        const categoriesRef = collection(db, this.collectionName);
        const q = query(
          categoriesRef,
          where("__name__", "in", batch),
          where("isActive", "==", true)
        );

        const querySnapshot = await getDocs(q);

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
            isFeatured: data.isFeatured,
            parentId: data.parentId || null,
            level: data.level || 0,
            children: data.children || [],
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          });
        });
      }

      return categories;
    } catch (error) {
      console.error("Error fetching categories by IDs:", error);
      throw new Error(
        `Failed to fetch categories: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getMainCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, this.collectionName);
      const q = query(
        categoriesRef,
        where("isActive", "==", true),
        where("level", "==", 0),
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
          isFeatured: data.isFeatured,
          parentId: data.parentId || null,
          level: data.level || 0,
          children: data.children || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return categories;
    } catch (error) {
      console.error("Error fetching main categories:", error);
      throw new Error(
        `Failed to fetch main categories: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getSubcategories(parentId: string): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, this.collectionName);
      const q = query(
        categoriesRef,
        where("isActive", "==", true),
        where("parentId", "==", parentId),
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
          isFeatured: data.isFeatured,
          parentId: data.parentId || null,
          level: data.level || 0,
          children: data.children || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      return categories;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw new Error(
        `Failed to fetch subcategories: ${
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
          isFeatured: data.isFeatured,
          parentId: data.parentId || null,
          level: data.level || 0,
          children: data.children || [],
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
            isFeatured: data.isFeatured,
            parentId: data.parentId || null,
            level: data.level || 0,
            children: data.children || [],
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
