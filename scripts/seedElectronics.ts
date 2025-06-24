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
    name: "iPhone 15 Pro",
    price: 999.99,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    category: "mobile",
    subcategory: "smartphones",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    price: 849.99,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
    category: "mobile",
    subcategory: "smartphones",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 3,
    name: "iPad Pro 12.9",
    price: 1099.99,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop",
    category: "mobile",
    subcategory: "tablets",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 4,
    name: "Wireless Power Bank",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1609592094469-0f9a3d0b3e3e?w=300&h=300&fit=crop",
    category: "mobile",
    subcategory: "accessories",
    rating: 4.3,
    inStock: false,
  },

  // Computers & Laptops
  {
    id: 5,
    name: "MacBook Pro 16",
    price: 2499.99,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    category: "computers",
    subcategory: "laptops",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 6,
    name: "Dell XPS 13",
    price: 1299.99,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
    category: "computers",
    subcategory: "laptops",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 7,
    name: "Gaming Desktop PC",
    price: 1899.99,
    image:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&h=300&fit=crop",
    category: "computers",
    subcategory: "desktop",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 8,
    name: "4K Monitor 27",
    price: 399.99,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    category: "computers",
    subcategory: "monitors",
    rating: 4.4,
    inStock: true,
  },

  // Gaming & Entertainment
  {
    id: 9,
    name: "PlayStation 5",
    price: 499.99,
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=300&h=300&fit=crop",
    category: "gaming",
    subcategory: "consoles",
    rating: 4.8,
    inStock: false,
  },
  {
    id: 10,
    name: "Xbox Series X",
    price: 499.99,
    image:
      "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300&h=300&fit=crop",
    category: "gaming",
    subcategory: "consoles",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 11,
    name: "Gaming Headset",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1583481411411-ca4b9b1c4d7e?w=300&h=300&fit=crop",
    category: "gaming",
    subcategory: "headsets",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 12,
    name: "Bluetooth Speaker",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    category: "gaming",
    subcategory: "speakers",
    rating: 4.2,
    inStock: true,
  },

  // Additional Electronics
  {
    id: 13,
    name: "AirPods Pro",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop",
    category: "audio",
    subcategory: "headphones",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 14,
    name: "Smart Watch",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    category: "wearables",
    subcategory: "watches",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 15,
    name: "Mechanical Keyboard",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
    category: "computers",
    subcategory: "keyboards",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 16,
    name: "Wireless Mouse",
    price: 69.99,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    category: "computers",
    subcategory: "mice",
    rating: 4.3,
    inStock: true,
  },
];

const uploadSampleData = async () => {
  try {
    console.log("\n🚀 Starting to upload sample electronics products...\n");

    for (const product of sampleProducts) {
      await setDoc(doc(db, "electronics", product.id.toString()), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Uploaded: ${product.name}`);
    }

    console.log("\n🎉 All electronics products uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading products:", error);
    process.exit(1);
  }
};

// Run the function
uploadSampleData();
