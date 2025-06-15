import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";
import type { Product } from "../types";

// Get all products with optional filters
export const getProducts = async (filters?: {
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}): Promise<Product[]> => {
  try {
    const productsQuery = collection(db, "products");
    const constraints = [];

    // Apply category filter
    if (filters?.category) {
      const categories = filters.category.split(",");
      constraints.push(where("category", "in", categories));
    }

    // Apply price filter
    if (filters?.minPrice && filters?.maxPrice) {
      constraints.push(
        where("price", ">=", Number.parseFloat(filters.minPrice))
      );
      constraints.push(
        where("price", "<=", Number.parseFloat(filters.maxPrice))
      );
    }

    // Apply sorting
    if (filters?.sort) {
      switch (filters.sort) {
        case "price-asc":
          constraints.push(orderBy("price", "asc"));
          break;
        case "price-desc":
          constraints.push(orderBy("price", "desc"));
          break;
        case "newest":
          constraints.push(orderBy("createdAt", "desc"));
          break;
        default:
          constraints.push(orderBy("name", "asc"));
      }
    } else {
      constraints.push(orderBy("name", "asc"));
    }

    const q = query(productsQuery, ...constraints);
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    // Apply search filter client-side (Firestore free tier doesn't support full-text search)
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
      );
    }

    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("featured", "==", true),
      limit(8)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error getting featured products:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    }

    return null;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
};

// Get related products
export const getRelatedProducts = async (
  productId: string,
  category: string
): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      where("id", "!=", productId),
      limit(4)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error getting related products:", error);
    return [];
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const categories = new Set<string>();

    querySnapshot.docs.forEach((doc) => {
      const product = doc.data() as Product;
      if (product.category) {
        categories.add(product.category);
      }
    });

    return Array.from(categories).sort();
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};
