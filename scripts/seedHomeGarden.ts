// scripts/uploadSampleData.ts
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// Load environment variables FIRST
dotenv.config();

// Initialize Firebase directly in this script
const firebaseConfig = {
  apiKey:
    process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN ||
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Check if config is loaded properly
console.log("Firebase Config Check:");
console.log("API Key:", firebaseConfig.apiKey ? "✓ Loaded" : "✗ Missing");
console.log("Project ID:", firebaseConfig.projectId || "✗ Missing");
console.log("Auth Domain:", firebaseConfig.authDomain || "✗ Missing");

// Validate required fields
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Missing required Firebase configuration!");
  console.error("Please check your .env file has:");
  console.error("- FIREBASE_API_KEY");
  console.error("- FIREBASE_PROJECT_ID");
  console.error("- FIREBASE_AUTH_DOMAIN");
  process.exit(1);
}

// Initialize Firebase app and Firestore (no auth needed for this script)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    id: 1,
    name: "Modern Wall Art Set",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
    category: "decor",
    subcategory: "wall-art",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 2,
    name: "Decorative Table Lamp",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    category: "decor",
    subcategory: "lighting",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 3,
    name: "Luxury Throw Pillow",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    category: "decor",
    subcategory: "pillows",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 4,
    name: "Ceramic Vase",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    category: "decor",
    subcategory: "vases",
    rating: 4.5,
    inStock: false,
  },

  // Furniture
  {
    id: 5,
    name: "Modern Sectional Sofa",
    price: 1299.99,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
    category: "furniture",
    subcategory: "sofas",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 6,
    name: "Oak Dining Table",
    price: 899.99,
    image:
      "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=300&h=300&fit=crop",
    category: "furniture",
    subcategory: "tables",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 7,
    name: "Ergonomic Office Chair",
    price: 349.99,
    image:
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop",
    category: "furniture",
    subcategory: "chairs",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 8,
    name: "Bedroom Storage Bench",
    price: 189.99,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    category: "furniture",
    subcategory: "storage",
    rating: 4.3,
    inStock: true,
  },

  // Garden & Outdoor
  {
    id: 9,
    name: "Garden Tool Set",
    price: 69.99,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
    category: "garden",
    subcategory: "tools",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 10,
    name: "Outdoor Patio Set",
    price: 599.99,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
    category: "garden",
    subcategory: "outdoor-furniture",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 11,
    name: "Herb Garden Kit",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
    category: "garden",
    subcategory: "plants",
    rating: 4.2,
    inStock: true,
  },
  {
    id: 12,
    name: "Solar Garden Lights",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    category: "garden",
    subcategory: "lighting",
    rating: 4.3,
    inStock: false,
  },

  // Additional Home Items
  {
    id: 13,
    name: "Persian Area Rug",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    category: "decor",
    subcategory: "rugs",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 14,
    name: "Kitchen Bar Stools",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
    category: "furniture",
    subcategory: "stools",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 15,
    name: "Watering Can Set",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
    category: "garden",
    subcategory: "irrigation",
    rating: 4.1,
    inStock: true,
  },
  {
    id: 16,
    name: "Decorative Mirror",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
    category: "decor",
    subcategory: "mirrors",
    rating: 4.6,
    inStock: true,
  },
];

const uploadSampleData = async () => {
  try {
    console.log("\n🚀 Starting to upload sample home products...\n");

    for (const product of sampleProducts) {
      await setDoc(doc(db, "home", product.id.toString()), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Uploaded: ${product.name}`);
    }

    console.log("\n🎉 All home products uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading products:", error);
    process.exit(1);
  }
};

// Run the function
uploadSampleData();
