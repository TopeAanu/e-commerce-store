// import { FirebaseApp } from "firebase/app";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   Timestamp,
//   DocumentReference,
// } from "firebase/firestore";

// // Interface for clothing item data
// export interface ClothingItem {
//   name: string;
//   description: string;
//   price: number;
//   size: string;
//   color: string;
//   material: string;
//   brand: string;
//   inStock: boolean;
//   quantity: number;
//   sku: string;
//   care_instructions: string;
//   imageUrl: string;
//   createdAt?: Timestamp;
//   updatedAt?: Timestamp;
// }

// // Generic interface for any item data
// export interface BaseItem {
//   [key: string]: any;
//   createdAt?: Timestamp;
//   updatedAt?: Timestamp;
// }

// // Options interface for configuration
// export interface SubcollectionOptions {
//   addTimestamps?: boolean;
//   verbose?: boolean;
// }

// // Return type for successful operations
// export interface SubcollectionResult<T = BaseItem> {
//   success: boolean;
//   docRef: DocumentReference;
//   path: string;
//   data: T;
// }

// /**
//  * Adds an item to a subcollection in Firebase Firestore
//  * @param app - Firebase app instance
//  * @param parentCollection - Name of the parent collection (e.g., "products")
//  * @param parentDocId - ID of the parent document (e.g., "id1")
//  * @param subcollection - Name of the subcollection (e.g., "clothing")
//  * @param itemId - ID for the new item document (e.g., "item1")
//  * @param itemData - Data object to store in the subcollection
//  * @param options - Optional configuration
//  * @returns Promise resolving to success object with document reference and path
//  */
// export async function addToSubcollection<T extends BaseItem>(
//   app: FirebaseApp,
//   parentCollection: string,
//   parentDocId: string,
//   subcollection: string,
//   itemId: string,
//   itemData: T,
//   options: SubcollectionOptions = {}
// ): Promise<SubcollectionResult<T>> {
//   const { addTimestamps = true, verbose = false } = options;

//   try {
//     const db = getFirestore(app);

//     // Create document reference
//     const docRef = doc(
//       db,
//       parentCollection,
//       parentDocId,
//       subcollection,
//       itemId
//     );
//     const docPath = `${parentCollection}/${parentDocId}/${subcollection}/${itemId}`;

//     // Prepare data with optional timestamps
//     let finalData: T = { ...itemData };
//     if (addTimestamps) {
//       const now = Timestamp.now();
//       finalData = {
//         ...finalData,
//         createdAt: finalData.createdAt || now,
//         updatedAt: now,
//       };
//     }

//     if (verbose) {
//       console.log(`Adding item to subcollection: ${docPath}`);
//     }

//     // Add the document
//     await setDoc(docRef, finalData);

//     if (verbose) {
//       console.log(`✓ Successfully added item to ${docPath}`);
//       if ("name" in finalData && "price" in finalData) {
//         console.log(`✓ Added: ${finalData.name} - $${finalData.price}`);
//       }
//     }

//     return {
//       success: true,
//       docRef,
//       path: docPath,
//       data: finalData,
//     };
//   } catch (error) {
//     if (verbose) {
//       console.error(
//         `❌ Error adding to subcollection:`,
//         (error as Error).message
//       );
//     }
//     throw new Error(
//       `Failed to add to subcollection: ${(error as Error).message}`
//     );
//   }
// }

// /**
//  * Specialized function for adding clothing items to products
//  * @param app - Firebase app instance
//  * @param productId - ID of the product document
//  * @param clothingId - ID for the clothing item
//  * @param clothingData - Clothing item data
//  * @param options - Optional configuration
//  * @returns Promise resolving to success object with document reference and path
//  */
// export async function addClothingToProduct(
//   app: FirebaseApp,
//   productId: string,
//   clothingId: string,
//   clothingData: ClothingItem,
//   options: SubcollectionOptions = {}
// ): Promise<SubcollectionResult<ClothingItem>> {
//   return addToSubcollection<ClothingItem>(
//     app,
//     "products",
//     productId,
//     "clothing",
//     clothingId,
//     clothingData,
//     options
//   );
// }

// /**
//  * Creates a sample clothing item object with default values
//  * @param overrides - Properties to override in the default clothing item
//  * @returns Clothing item data object
//  */
// export function createClothingItem(
//   overrides: Partial<ClothingItem> = {}
// ): ClothingItem {
//   const defaultClothing: ClothingItem = {
//     name: "Premium Cotton Hoodie",
//     description:
//       "Comfortable cotton hoodie with kangaroo pocket and adjustable drawstring hood.",
//     price: 65.99,
//     size: "Medium",
//     color: "Navy Blue",
//     material: "100% Cotton",
//     brand: "ComfortWear",
//     inStock: true,
//     quantity: 15,
//     sku: "CW-HOOD-NVY-M",
//     care_instructions: "Machine wash cold, tumble dry low",
//     imageUrl: "https://i.ibb.co/example/cotton-hoodie.jpg",
//   };

//   return { ...defaultClothing, ...overrides };
// }

// // Additional interfaces for other common item types
// export interface ReviewItem extends BaseItem {
//   rating: number;
//   comment: string;
//   userId: string;
//   userName?: string;
//   verified?: boolean;
// }

// export interface VariantItem extends BaseItem {
//   size: string;
//   color: string;
//   stock: number;
//   priceModifier: number;
//   available?: boolean;
// }

// export interface AccessoryItem extends BaseItem {
//   name: string;
//   price: number;
//   material: string;
//   color: string;
//   category?: string;
// }
