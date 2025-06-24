// // lib/firebase/clothing.ts
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   doc,
//   getDoc,
//   Timestamp,
// } from "firebase/firestore";
// import app from "./config"; // Adjust path to your Firebase config

// const db = getFirestore(app);

// // Define the ClothingItem interface
// export interface ClothingItem {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   size?: string;
//   color?: string;
//   material?: string;
//   brand?: string;
//   inStock?: boolean;
//   quantity?: number;
//   sku?: string;
//   care_instructions?: string;
//   imageUrl: string;
//   createdAt?: Timestamp;
//   updatedAt?: Timestamp;
//   [key: string]: any; // Allow additional properties
// }

// // Define filters interface
// export interface ClothingFilters {
//   size?: string;
//   color?: string;
//   material?: string;
//   brand?: string;
//   inStock?: boolean;
//   [key: string]: any;
// }

// /**
//  * Get all clothing items from the clothing subcollection of a specific product
//  */
// export async function getClothingCollection(
//   productId: string
// ): Promise<ClothingItem[]> {
//   try {
//     console.log(`Fetching clothing collection for product: ${productId}`);

//     // Reference to the clothing subcollection
//     const clothingCollectionRef = collection(
//       db,
//       "products",
//       productId,
//       "clothing"
//     );

//     // Get all documents in the clothing subcollection
//     const querySnapshot = await getDocs(clothingCollectionRef);

//     if (querySnapshot.empty) {
//       console.log(`No clothing items found for product ${productId}`);
//       return [];
//     }

//     // Map through documents and return data with IDs
//     const clothingItems: ClothingItem[] = querySnapshot.docs.map(
//       (doc) =>
//         ({
//           id: doc.id,
//           ...doc.data(),
//         } as ClothingItem)
//     );

//     console.log(
//       `Found ${clothingItems.length} clothing items for product ${productId}`
//     );
//     return clothingItems;
//   } catch (error) {
//     console.error(
//       `Error fetching clothing collection for product ${productId}:`,
//       error
//     );
//     throw error;
//   }
// }

// /**
//  * Get a specific clothing item from the clothing subcollection
//  */
// export async function getClothingItem(
//   productId: string,
//   clothingId: string
// ): Promise<ClothingItem | null> {
//   try {
//     console.log(
//       `Fetching clothing item ${clothingId} for product: ${productId}`
//     );

//     // Reference to the specific clothing document
//     const clothingDocRef = doc(
//       db,
//       "products",
//       productId,
//       "clothing",
//       clothingId
//     );

//     // Get the document
//     const docSnap = await getDoc(clothingDocRef);

//     if (!docSnap.exists()) {
//       console.log(
//         `Clothing item ${clothingId} not found for product ${productId}`
//       );
//       return null;
//     }

//     const clothingItem: ClothingItem = {
//       id: docSnap.id,
//       ...docSnap.data(),
//     } as ClothingItem;

//     console.log(`Found clothing item: ${clothingItem.name}`);
//     return clothingItem;
//   } catch (error) {
//     console.error(
//       `Error fetching clothing item ${clothingId} for product ${productId}:`,
//       error
//     );
//     throw error;
//   }
// }

// /**
//  * Get clothing collection with additional filtering options
//  */
// export async function getFilteredClothingCollection(
//   productId: string,
//   filters: ClothingFilters = {}
// ): Promise<ClothingItem[]> {
//   try {
//     const clothingItems = await getClothingCollection(productId);

//     if (!filters || Object.keys(filters).length === 0) {
//       return clothingItems;
//     }

//     // Apply filters
//     return clothingItems.filter((item: ClothingItem) => {
//       return Object.entries(filters).every(([key, value]) => {
//         if (!value) return true; // Skip empty filters
//         const itemValue = (item as any)[key];
//         return (
//           itemValue?.toLowerCase?.() === value.toLowerCase?.() ||
//           itemValue === value
//         );
//       });
//     });
//   } catch (error) {
//     console.error(`Error fetching filtered clothing collection:`, error);
//     throw error;
//   }
// }
