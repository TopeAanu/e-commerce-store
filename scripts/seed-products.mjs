// This script seeds the Firebase Firestore database with sample products
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug paths
console.log("Current directory:", __dirname);
console.log("Looking for .env at:", path.join(__dirname, "..", ".env"));

// Try multiple .env file locations
const envPaths = [
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "..", ".env.local"),
  path.join(__dirname, ".env"),
  ".env",
];

let envLoaded = false;
for (const envPath of envPaths) {
  try {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      console.log(`✓ Successfully loaded environment from: ${envPath}`);
      envLoaded = true;
      break;
    }
  } catch (error) {
    // Continue to next path
  }
}

if (!envLoaded) {
  console.log("❌ Could not load any .env file from:", envPaths);
}

// Debug: Check if environment variables are loaded
console.log("\nEnvironment Variables Check:");
console.log(
  "API Key:",
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded ✓" : "Missing ✗"
);
console.log(
  "Project ID:",
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Missing ✗"
);

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

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "Electronics",
    featured: true,
    inventory: 50,
    imageUrl: "https://i.ibb.co/gMV6gHc9/bluetoothheadphones.jpg",
    createdAt: Timestamp.now(), // Fixed: Use Firestore Timestamp
  },
  {
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    category: "Clothing",
    featured: false,
    inventory: 100,
    imageUrl: "https://i.ibb.co/nqMXH9Vh/tshirt-1.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Smart Home Security Camera",
    description:
      "1080p HD security camera with night vision and mobile app integration.",
    price: 149.99,
    category: "Electronics",
    featured: true,
    inventory: 25,
    imageUrl: "https://i.ibb.co/tP1zrDcq/homecamera.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Ceramic Coffee Mug Set",
    description:
      "Set of 4 handcrafted ceramic coffee mugs perfect for your morning routine.",
    price: 39.99,
    category: "Home",
    featured: false,
    inventory: 75,
    imageUrl: "https://i.ibb.co/v41pfBCT/ceramic-cofee.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Natural Face Moisturizer",
    description:
      "Hydrating face moisturizer made with natural ingredients for all skin types.",
    price: 24.99,
    category: "Beauty",
    featured: true,
    inventory: 60,
    imageUrl: "https://i.ibb.co/KjqZ3yFb/facemoisture-1.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip premium yoga mat with extra cushioning for comfortable practice.",
    price: 79.99,
    category: "Sports",
    featured: false,
    inventory: 40,
    imageUrl: "https://i.ibb.co/ccjSXmFm/yogamat2-1.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated stainless steel water bottle that keeps drinks cold for 24 hours.",
    price: 34.99,
    category: "Home",
    featured: true,
    inventory: 80,
    imageUrl: "https://i.ibb.co/mr8k9zk4/steelwaterbottle.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Wireless Phone Charger",
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 49.99,
    category: "Electronics",
    featured: false,
    inventory: 35,
    imageUrl: "https://i.ibb.co/hJ3P1Tzk/wirelesscharger.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Denim Jacket Classic",
    description:
      "Timeless denim jacket made from premium denim with a comfortable fit.",
    price: 89.99,
    category: "Clothing",
    featured: true,
    inventory: 30,
    imageUrl: "https://i.ibb.co/v48M4rJB/jacket-1.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Essential Oil Diffuser",
    description:
      "Ultrasonic essential oil diffuser with LED lights and timer settings.",
    price: 59.99,
    category: "Home",
    featured: false,
    inventory: 45,
    imageUrl: "https://i.ibb.co/xtcrhfNj/oildifuser-1.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Vitamin C Serum",
    description:
      "Brightening vitamin C serum that helps reduce dark spots and improve skin texture.",
    price: 32.99,
    category: "Beauty",
    featured: true,
    inventory: 55,
    imageUrl: "https://i.ibb.co/6RMHjsnv/vitaminc.jpg",
    createdAt: Timestamp.now(),
  },
  {
    name: "Bluetooth Speaker Portable",
    description:
      "Compact waterproof Bluetooth speaker with 12-hour battery life.",
    price: 69.99,
    category: "Electronics",
    featured: false,
    inventory: 65,
    imageUrl: "https://i.ibb.co/rR0C50Lk/portablespeaker-1.jpg",
    createdAt: Timestamp.now(),
  },
];

async function clearProducts() {
  console.log("Clearing existing products...");
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Deleted ${querySnapshot.docs.length} existing products.`);
  } catch (error) {
    console.error("Error clearing products:", error);
  }
}

async function seedProducts() {
  try {
    console.log("Starting to seed products...");

    // Clear existing products first
    await clearProducts();

    // Add new products
    console.log("Adding new products...");
    const addPromises = sampleProducts.map(async (product, index) => {
      try {
        const docRef = await addDoc(collection(db, "products"), product);
        console.log(`✓ Added product ${index + 1}: ${product.name}`);
        return docRef;
      } catch (error) {
        console.error(
          `✗ Failed to add product ${index + 1}: ${product.name}`,
          error
        );
        throw error;
      }
    });

    await Promise.all(addPromises);

    console.log(
      `\n🎉 Successfully seeded ${sampleProducts.length} products to Firestore!`
    );
    console.log("\nProducts added:");
    sampleProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} - $${product.price} (${
          product.category
        })`
      );
    });
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    console.error("Full error details:", error.message);
  }
}

// Run the seeding function
seedProducts();
