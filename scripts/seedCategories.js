// seedCategories.js
const path = require("path");
// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  setDoc,
  doc,
  Timestamp,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate required environment variables
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Categories data
const categories = [
  {
    id: "electronics", // Add unique ID
    name: "Electronics",
    slug: "electronics",
    image: "https://i.ibb.co/21tTFt13/electronics.jpg",
    description: "Latest gadgets and electronic devices",
    productCount: 150,
    isActive: true,
    isFeatured: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: "clothing-fashion", // Add unique ID
    name: "Clothing & Fashion",
    slug: "clothing-fashion",
    image: "https://i.ibb.co/CKwRhQDk/home-appliance.jpg",
    description: "Trendy clothes and fashion accessories",
    productCount: 89,
    isActive: true,
    isFeatured: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: "home-garden", // Add unique ID
    name: "Home & Garden",
    slug: "home-garden",
    image: "https://i.ibb.co/CKwRhQDk/home-appliance.jpg",
    description: "Everything for your home and garden",
    productCount: 234,
    isActive: true,
    isFeatured: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: "sports-outdoors", // Add unique ID
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    image: "https://i.ibb.co/hJVZwRh6/sports-1.jpg",
    description: "Sports equipment and outdoor gear",
    productCount: 167,
    isActive: true,
    isFeatured: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

async function seedCategories() {
  try {
    console.log("Starting to seed categories...");

    for (const category of categories) {
      // Extract the ID and remove it from the document data
      const { id, ...categoryData } = category;

      // Use setDoc with specific document ID to override existing data
      await setDoc(doc(db, "categories", id), categoryData);
      console.log(`✅ Upserted category: ${category.name} with ID: ${id}`);
    }

    console.log("🎉 All categories seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  } finally {
    process.exit(0);
  }
}

// Run the seeder
seedCategories();
