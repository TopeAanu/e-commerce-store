// // lib/firebase/seedCategories.ts
// import { collection, addDoc, writeBatch, doc } from "firebase/firestore";
// import { db } from "./config";

// // Sample category data
// const categoriesData = [
//   {
//     name: "Electronics",
//     slug: "electronics",
//     description:
//       "Latest gadgets, smartphones, laptops, and electronic accessories",
//     imageUrl:
//       "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     name: "Clothing & Fashion",
//     slug: "clothing-fashion",
//     description:
//       "Trendy apparel, shoes, and fashion accessories for all occasions",
//     imageUrl:
//       "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     name: "Home & Garden",
//     slug: "home-garden",
//     description: "Everything for your home, garden, and outdoor living spaces",
//     imageUrl:
//       "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     name: "Sports & Outdoors",
//     slug: "sports-outdoors",
//     description: "Sports equipment, outdoor gear, and fitness accessories",
//     imageUrl:
//       "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     name: "Books",
//     slug: "books",
//     description: "Fiction, non-fiction, educational books, and e-books",
//     imageUrl:
//       "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     name: "Beauty & Health",
//     slug: "beauty-health",
//     description: "Skincare, makeup, health supplements, and wellness products",
//     imageUrl:
//       "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     name: "Toys & Games",
//     slug: "toys-games",
//     description: "Fun toys, board games, and educational games for all ages",
//     imageUrl:
//       "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     name: "Food & Beverages",
//     slug: "food-beverages",
//     description: "Gourmet foods, snacks, beverages, and kitchen essentials",
//     imageUrl:
//       "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400&h=300&fit=crop",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

// // Sample products data with category references
// const productsData = [
//   // Electronics
//   {
//     name: "iPhone 15 Pro",
//     categoryId: "", // Will be filled after categories are created
//     categoryName: "Electronics",
//     price: 999.99,
//     description: "Latest iPhone with advanced camera system and A17 Pro chip",
//     imageUrl:
//       "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
//     inStock: true,
//     createdAt: new Date(),
//   },
//   {
//     name: "MacBook Air M3",
//     categoryId: "",
//     categoryName: "Electronics",
//     price: 1299.99,
//     description: "Powerful and lightweight laptop with M3 chip",
//     imageUrl:
//       "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
//     inStock: true,
//     createdAt: new Date(),
//   },

//   // Clothing & Fashion
//   {
//     name: "Classic White T-Shirt",
//     categoryId: "",
//     categoryName: "Clothing & Fashion",
//     price: 29.99,
//     description: "Premium cotton t-shirt for everyday comfort",
//     imageUrl:
//       "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
//     inStock: true,
//     createdAt: new Date(),
//   },
//   {
//     name: "Denim Jacket",
//     categoryId: "",
//     categoryName: "Clothing & Fashion",
//     price: 89.99,
//     description: "Vintage-style denim jacket with classic fit",
//     imageUrl:
//       "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
//     inStock: true,
//     createdAt: new Date(),
//   },

//   // Home & Garden
//   {
//     name: "Modern Floor Lamp",
//     categoryId: "",
//     categoryName: "Home & Garden",
//     price: 149.99,
//     description: "Sleek LED floor lamp with adjustable brightness",
//     imageUrl:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
//     inStock: true,
//     createdAt: new Date(),
//   },
//   {
//     name: "Ceramic Plant Pot Set",
//     categoryId: "",
//     categoryName: "Home & Garden",
//     price: 34.99,
//     description: "Set of 3 beautiful ceramic pots for indoor plants",
//     imageUrl:
//       "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop",
//     inStock: true,
//     createdAt: new Date(),
//   },

//   // Books
//   {
//     name: "The Art of Programming",
//     categoryId: "",
//     categoryName: "Books",
//     price: 45.99,
//     description: "Comprehensive guide to modern programming techniques",
//     imageUrl:
//       "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
//     inStock: true,
//     createdAt: new Date(),
//   },
//   {
//     name: "Mindfulness Meditation",
//     categoryId: "",
//     categoryName: "Books",
//     price: 19.99,
//     description: "A practical guide to mindfulness and meditation",
//     imageUrl:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
//     inStock: false,
//     createdAt: new Date(),
//   },
// ];

// export async function seedCategories() {
//   try {
//     console.log("Starting to seed categories...");

//     // Add categories first
//     const categoryMap = new Map<string, string>();

//     for (const categoryData of categoriesData) {
//       const docRef = await addDoc(collection(db, "categories"), categoryData);
//       categoryMap.set(categoryData.name, docRef.id);
//       console.log(`Added category: ${categoryData.name} with ID: ${docRef.id}`);
//     }

//     console.log("Starting to seed products...");

//     // Add products with category IDs
//     const batch = writeBatch(db);

//     productsData.forEach((productData) => {
//       const categoryId = categoryMap.get(productData.categoryName);
//       if (categoryId) {
//         const productRef = doc(collection(db, "products"));
//         const { categoryName, ...productWithoutCategoryName } = productData;

//         batch.set(productRef, {
//           ...productWithoutCategoryName,
//           categoryId,
//         });
//       }
//     });

//     await batch.commit();
//     console.log("Successfully seeded all products!");

//     console.log(`
//     ✅ Seeding completed successfully!
//     📁 Categories created: ${categoriesData.length}
//     📦 Products created: ${productsData.length}
//     `);
//   } catch (error) {
//     console.error("Error seeding data:", error);
//     throw error;
//   }
// }

// // Alternative: Simple seed function you can run in browser console or Node.js script
// export async function quickSeedCategories() {
//   const simpleCategories = [
//     { name: "Electronics", slug: "electronics" },
//     { name: "Clothing", slug: "clothing" },
//     { name: "Home & Garden", slug: "home-garden" },
//     { name: "Books", slug: "books" },
//     { name: "Sports", slug: "sports" },
//   ];

//   for (const category of simpleCategories) {
//     await addDoc(collection(db, "categories"), {
//       ...category,
//       description: `Browse our ${category.name.toLowerCase()} collection`,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     console.log(`Added ${category.name}`);
//   }

//   console.log("Quick seed completed!");
// }
