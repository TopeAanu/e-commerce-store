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
  // Women's Fashion
  {
    id: 1,
    name: "Floral Summer Dress",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop",
    category: "women",
    subcategory: "dresses",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: "Classic White Blouse",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1564257577817-4e3c8e0f3b8b?w=300&h=300&fit=crop",
    category: "women",
    subcategory: "tops",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 3,
    name: "High-Waisted Jeans",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop",
    category: "women",
    subcategory: "jeans",
    rating: 4.3,
    inStock: true,
  },
  {
    id: 4,
    name: "Leather Jacket",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
    category: "women",
    subcategory: "jackets",
    rating: 4.7,
    inStock: false,
  },
  // Men's Clothing
  {
    id: 5,
    name: "Cotton Polo Shirt",
    price: 35.99,
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop",
    category: "men",
    subcategory: "shirts",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 6,
    name: "Chino Pants",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop",
    category: "men",
    subcategory: "pants",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 7,
    name: "Navy Blue Suit",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    category: "men",
    subcategory: "formal",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 8,
    name: "Casual Hoodie",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop",
    category: "men",
    subcategory: "casual",
    rating: 4.2,
    inStock: true,
  },
  // Shoes & Accessories
  {
    id: 9,
    name: "White Sneakers",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
    category: "accessories",
    subcategory: "sneakers",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 10,
    name: "Leather Handbag",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "accessories",
    subcategory: "bags",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 11,
    name: "Gold Watch",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop",
    category: "accessories",
    subcategory: "watches",
    rating: 4.8,
    inStock: false,
  },
  {
    id: 12,
    name: "Leather Belt",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "accessories",
    subcategory: "belts",
    rating: 4.3,
    inStock: true,
  },
];

const uploadSampleData = async () => {
  try {
    console.log("\n🚀 Starting to upload sample clothing products...\n");

    for (const product of sampleProducts) {
      await setDoc(doc(db, "clothing", product.id.toString()), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Uploaded: ${product.name}`);
    }

    console.log("\n🎉 All clothing products uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading products:", error);
    process.exit(1);
  }
};

// Run the function
uploadSampleData();
