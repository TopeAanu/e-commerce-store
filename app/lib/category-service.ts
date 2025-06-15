// lib/services/categoryService.ts
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { Category, Product } from "../lib/types";

export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, "categories");
      const categoriesSnap = await getDocs(
        query(categoriesRef, orderBy("name"))
      );

      const categories: Category[] = [];

      for (const doc of categoriesSnap.docs) {
        const categoryData = doc.data();

        // Get product count for each category
        const productsRef = collection(db, "products");
        const productCountQuery = query(
          productsRef,
          where("categoryId", "==", doc.id)
        );
        const productCountSnap = await getCountFromServer(productCountQuery);

        categories.push({
          id: doc.id,
          ...categoryData,
          productCount: productCountSnap.data().count,
          createdAt: categoryData.createdAt?.toDate() || new Date(),
          updatedAt: categoryData.updatedAt?.toDate() || new Date(),
        } as Category);
      }

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  static async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      const categorySnap = await getDoc(categoryRef);

      if (!categorySnap.exists()) {
        return null;
      }

      const categoryData = categorySnap.data();

      // Get product count
      const productsRef = collection(db, "products");
      const productCountQuery = query(
        productsRef,
        where("categoryId", "==", categoryId)
      );
      const productCountSnap = await getCountFromServer(productCountQuery);

      return {
        id: categorySnap.id,
        ...categoryData,
        productCount: productCountSnap.data().count,
        createdAt: categoryData.createdAt?.toDate() || new Date(),
        updatedAt: categoryData.updatedAt?.toDate() || new Date(),
      } as Category;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Failed to fetch category");
    }
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const categoriesRef = collection(db, "categories");
      const categoryQuery = query(categoriesRef, where("slug", "==", slug));
      const categorySnap = await getDocs(categoryQuery);

      if (categorySnap.empty) {
        return null;
      }

      const categoryDoc = categorySnap.docs[0];
      const categoryData = categoryDoc.data();

      // Get product count
      const productsRef = collection(db, "products");
      const productCountQuery = query(
        productsRef,
        where("categoryId", "==", categoryDoc.id)
      );
      const productCountSnap = await getCountFromServer(productCountQuery);

      return {
        id: categoryDoc.id,
        ...categoryData,
        productCount: productCountSnap.data().count,
        createdAt: categoryData.createdAt?.toDate() || new Date(),
        updatedAt: categoryData.updatedAt?.toDate() || new Date(),
      } as Category;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      throw new Error("Failed to fetch category");
    }
  }

  static async getProductsByCategory(
    categoryId: string,
    pageSize: number = 12,
    lastProductId?: string
  ): Promise<{ products: Product[]; hasMore: boolean }> {
    try {
      const productsRef = collection(db, "products");
      let productsQuery = query(
        productsRef,
        where("categoryId", "==", categoryId),
        orderBy("createdAt", "desc"),
        limit(pageSize + 1) // Get one extra to check if there are more
      );

      if (lastProductId) {
        const lastProductDoc = await getDoc(doc(db, "products", lastProductId));
        if (lastProductDoc.exists()) {
          productsQuery = query(
            productsRef,
            where("categoryId", "==", categoryId),
            orderBy("createdAt", "desc"),
            startAfter(lastProductDoc),
            limit(pageSize + 1)
          );
        }
      }

      const productsSnap = await getDocs(productsQuery);
      const products: Product[] = [];

      productsSnap.docs.forEach((doc) => {
        const productData = doc.data();
        products.push({
          id: doc.id,
          ...productData,
          createdAt: productData.createdAt?.toDate() || new Date(),
        } as Product);
      });

      const hasMore = products.length > pageSize;
      if (hasMore) {
        products.pop(); // Remove the extra product
      }

      return { products, hasMore };
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw new Error("Failed to fetch products");
    }
  }
}
