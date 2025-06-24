// lib/firebase/clothing-manager.ts
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

// Interface for clothing item data
export interface ClothingItemData {
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
 * Fetches all clothing items for a specific product
 * @param productId - The ID of the product to fetch clothing for
 * @returns Promise<ClothingItemData[]> - Array of clothing items with their IDs
 */
export async function getClothingItems(
  productId: string
): Promise<(ClothingItemData & { id: string })[]> {
  try {
    console.log(`Fetching clothing items for product ${productId}...`);

    // Reference to the clothing subcollection
    const clothingCollectionRef = collection(
      db,
      "products",
      productId,
      "clothing"
    );

    // Create a query to order by creation date (optional)
    const clothingQuery = query(
      clothingCollectionRef,
      orderBy("createdAt", "desc")
    );

    // Get all documents in the subcollection
    const querySnapshot = await getDocs(clothingQuery);

    // Map the documents to clothing items with IDs
    const clothingItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (ClothingItemData & { id: string })[];

    console.log(
      `✓ Successfully fetched ${clothingItems.length} clothing items`
    );
    return clothingItems;
  } catch (error) {
    console.error("❌ Error fetching clothing items:", error);
    throw error;
  }
}
