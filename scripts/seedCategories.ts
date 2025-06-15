// scripts/seedCategories.ts
import { config } from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Load environment variables from .env file
config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface SeedProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
  inventory: number;
  imageUrl: string;
  createdAt: string;
}

const productsWithCategories: SeedProduct[] = [
  // Electronics Category
  {
    name: "Bluetooth Speaker",
    description: "Portable wireless speaker with deep bass",
    price: 89.99,
    category: "Electronics",
    featured: false,
    inventory: 25,
    imageUrl: "https://via.placeholder.com/400x300/2563eb/ffffff?text=Speaker",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13).toISOString(),
  },
  {
    name: "USB Cable",
    description: "High-speed USB-C charging cable",
    price: 19.99,
    category: "Electronics",
    featured: false,
    inventory: 100,
    imageUrl:
      "https://via.placeholder.com/400x300/dc2626/ffffff?text=USB+Cable",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },

  // Clothing Category
  {
    name: "Baseball Cap",
    description: "Adjustable cotton baseball cap",
    price: 24.99,
    category: "Clothing",
    featured: false,
    inventory: 50,
    imageUrl:
      "https://via.placeholder.com/400x300/059669/ffffff?text=Baseball+Cap",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    name: "Winter Jacket",
    description: "Warm winter jacket with hood",
    price: 129.99,
    category: "Clothing",
    featured: false,
    inventory: 20,
    imageUrl:
      "https://via.placeholder.com/400x300/1f2937/ffffff?text=Winter+Jacket",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
  },

  // Home & Garden Category
  {
    name: "Table Lamp",
    description: "Modern LED table lamp with adjustable brightness",
    price: 45.99,
    category: "Home & Garden",
    featured: false,
    inventory: 30,
    imageUrl:
      "https://via.placeholder.com/400x300/0891b2/ffffff?text=Table+Lamp",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(),
  },
  {
    name: "Garden Gloves",
    description: "Waterproof gardening gloves",
    price: 12.99,
    category: "Home & Garden",
    featured: false,
    inventory: 75,
    imageUrl:
      "https://via.placeholder.com/400x300/16a34a/ffffff?text=Garden+Gloves",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
  },
];

async function seedDatabase() {
  console.log(
    "Starting to seed database with categorized products in separate collection..."
  );

  try {
    // Use a separate collection for category testing
    const categoryProductsRef = collection(db, "category-products");

    for (const product of productsWithCategories) {
      await addDoc(categoryProductsRef, product);
      console.log(`Added: ${product.name} (${product.category})`);
    }

    console.log(
      `\n✅ Successfully added ${productsWithCategories.length} products to 'category-products' collection!`
    );
    console.log("\nCategories created:");
    const categories = [
      ...new Set(productsWithCategories.map((p) => p.category)),
    ];
    categories.forEach((cat) => console.log(`- ${cat}`));

    console.log("\n📝 Note: Products stored in 'category-products' collection");
    console.log(
      "Your 'products' collection for featured products is untouched."
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase();
