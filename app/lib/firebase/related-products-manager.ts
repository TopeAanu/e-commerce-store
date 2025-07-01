// lib/firebase/related-products-manager.ts
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config"; // Your Firebase config

// Interface for related product item data
export interface RelatedProductItemData {
  name: string;
  description: string;
  price: number;
  size?: string;
  color?: string;
  material?: string;
  brand?: string;
  inStock?: boolean;
  quantity?: number;
  sku?: string;
  care_instructions?: string;
  imageUrl?: string;
}

/**
 * Fetches all related product items for a specific product
 * @param productId - The ID of the product to fetch related products for
 * @returns Promise<RelatedProductItemData[]> - Array of related product items with their IDs
 */
export async function getRelatedProductItems(
  productId: string
): Promise<(RelatedProductItemData & { id: string })[]> {
  try {
    console.log(`Fetching related product items for product ${productId}...`);

    // Reference to the related products subcollection
    const relatedProductsCollectionRef = collection(
      db,
      "products",
      productId,
      "related-products"
    );

    // Create a query to order by creation date (optional)
    const relatedProductsQuery = query(
      relatedProductsCollectionRef,
      orderBy("createdAt", "desc")
    );

    // Get all documents in the subcollection
    const querySnapshot = await getDocs(relatedProductsQuery);

    // Map the documents to related product items with IDs
    const relatedProductItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (RelatedProductItemData & { id: string })[];

    console.log(
      `✓ Successfully fetched ${relatedProductItems.length} related product items`
    );
    return relatedProductItems;
  } catch (error) {
    console.error("❌ Error fetching related product items:", error);
    throw error;
  }
}
