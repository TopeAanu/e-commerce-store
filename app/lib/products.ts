// // app/lib/firebase/products.ts
// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   limit,
//   QueryConstraint,
// } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   featured: boolean;
//   inventory: number;
//   imageUrl: string;
//   createdAt: string;
// }

// // Get all products with optional filters
// export async function getProducts(
//   searchParams: {
//     category?: string;
//     sort?: string;
//     minPrice?: string;
//     maxPrice?: string;
//   } = {}
// ): Promise<Product[]> {
//   try {
//     const productsRef = collection(db, "products");
//     const constraints: QueryConstraint[] = [];

//     // Add category filter
//     if (searchParams.category) {
//       constraints.push(where("category", "==", searchParams.category));
//     }

//     // Add price filters
//     if (searchParams.minPrice) {
//       const minPrice = parseFloat(searchParams.minPrice);
//       if (!isNaN(minPrice)) {
//         constraints.push(where("price", ">=", minPrice));
//       }
//     }

//     if (searchParams.maxPrice) {
//       const maxPrice = parseFloat(searchParams.maxPrice);
//       if (!isNaN(maxPrice)) {
//         constraints.push(where("price", "<=", maxPrice));
//       }
//     }

//     // Add sorting
//     if (searchParams.sort) {
//       switch (searchParams.sort) {
//         case "price-asc":
//           constraints.push(orderBy("price", "asc"));
//           break;
//         case "price-desc":
//           constraints.push(orderBy("price", "desc"));
//           break;
//         case "name":
//           constraints.push(orderBy("name", "asc"));
//           break;
//         case "newest":
//           constraints.push(orderBy("createdAt", "desc"));
//           break;
//         default:
//           constraints.push(orderBy("createdAt", "desc"));
//       }
//     } else {
//       constraints.push(orderBy("createdAt", "desc"));
//     }

//     const q = query(productsRef, ...constraints);
//     const querySnapshot = await getDocs(q);

//     const products: Product[] = [];
//     querySnapshot.forEach((doc) => {
//       products.push({
//         id: doc.id,
//         ...doc.data(),
//       } as Product);
//     });

//     return products;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return [];
//   }
// }

// // Get a single product by ID
// export async function getProductById(id: string): Promise<Product | null> {
//   try {
//     const docRef = doc(db, "products", id);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       return {
//         id: docSnap.id,
//         ...docSnap.data(),
//       } as Product;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     return null;
//   }
// }

// // Get related products (same category, excluding current product)
// export async function getRelatedProducts(
//   productId: string,
//   category: string,
//   maxResults: number = 4
// ): Promise<Product[]> {
//   try {
//     const productsRef = collection(db, "products");
//     const q = query(
//       productsRef,
//       where("category", "==", category),
//       orderBy("createdAt", "desc"),
//       limit(maxResults + 1) // Get one extra to exclude current product
//     );

//     const querySnapshot = await getDocs(q);
//     const products: Product[] = [];

//     querySnapshot.forEach((doc) => {
//       // Exclude the current product
//       if (doc.id !== productId) {
//         products.push({
//           id: doc.id,
//           ...doc.data(),
//         } as Product);
//       }
//     });

//     // Return only the requested number of products
//     return products.slice(0, maxResults);
//   } catch (error) {
//     console.error("Error fetching related products:", error);
//     return [];
//   }
// }

// // Get featured products
// export async function getFeaturedProducts(
//   maxResults: number = 6
// ): Promise<Product[]> {
//   try {
//     const productsRef = collection(db, "products");
//     const q = query(
//       productsRef,
//       where("featured", "==", true),
//       orderBy("createdAt", "desc"),
//       limit(maxResults)
//     );

//     const querySnapshot = await getDocs(q);
//     const products: Product[] = [];

//     querySnapshot.forEach((doc) => {
//       products.push({
//         id: doc.id,
//         ...doc.data(),
//       } as Product);
//     });

//     return products;
//   } catch (error) {
//     console.error("Error fetching featured products:", error);
//     return [];
//   }
// }

// // Get all unique categories
// export async function getCategories(): Promise<string[]> {
//   try {
//     const productsRef = collection(db, "category-products");
//     const querySnapshot = await getDocs(productsRef);

//     const categories = new Set<string>();
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       if (data.category) {
//         categories.add(data.category);
//       }
//     });

//     return Array.from(categories).sort();
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return [];
//   }
// }
