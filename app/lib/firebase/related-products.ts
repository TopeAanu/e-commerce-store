// app/lib/firebase/related-products.ts
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "./config";

// Define a simple type for clothing items
interface ClothingItem {
  id: string;
  [key: string]: any;
}

// Get products from clothing subcollection under a specific document
export const getClothingProducts = async (
  documentId: string,
  limitCount: number = 10
): Promise<ClothingItem[]> => {
  try {
    // Reference to the subcollection: products/{documentId}/clothing
    const clothingRef = collection(db, "products", documentId, "clothing");

    // Create query with optional ordering and limit
    const q = query(
      clothingRef,
      orderBy("createdAt", "desc"), // Remove this line if createdAt field doesn't exist
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);

    // Convert to simple array of objects
    const clothingItems: ClothingItem[] = [];
    querySnapshot.forEach((doc) => {
      clothingItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return clothingItems;
  } catch (error) {
    console.error("Error getting clothing products:", error);
    return [];
  }
};

// Alternative version without ordering (in case createdAt field doesn't exist)
export const getClothingProductsSimple = async (
  documentId: string,
  limitCount: number = 10
): Promise<ClothingItem[]> => {
  try {
    const clothingRef = collection(db, "products", documentId, "clothing");
    const q = query(clothingRef, limit(limitCount));

    const querySnapshot = await getDocs(q);

    const clothingItems: ClothingItem[] = [];
    querySnapshot.forEach((doc) => {
      clothingItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return clothingItems;
  } catch (error) {
    console.error("Error getting clothing products:", error);
    return [];
  }
};

// Usage example:
// const items = await getClothingProducts("id1", 5);
// console.log(items);
