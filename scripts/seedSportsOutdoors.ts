// scripts/seedSportsOutdoors.ts
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
  // Fitness & Training
  // {
  //   id: 1,
  //   name: "Adjustable Dumbbell Set",
  //   price: 299.99,
  //   image:
  //     "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
  //   category: "fitness",
  //   subcategory: "weights",
  //   rating: 4.8,
  //   inStock: true,
  // },
  {
    id: 2,
    name: "Yoga Mat Premium",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    category: "fitness",
    subcategory: "yoga",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 3,
    name: "Resistance Band Set",
    price: 24.99,
    image: "https://i.ibb.co/nqP8kXyB/woman-working-out-alone.jpg",
    category: "fitness",
    subcategory: "resistance",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 4,
    name: "Foam Roller",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    category: "fitness",
    subcategory: "recovery",
    rating: 4.5,
    inStock: false,
  },

  // Outdoor Adventure
  {
    id: 5,
    name: "4-Person Camping Tent",
    price: 189.99,
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop",
    category: "outdoor",
    subcategory: "camping",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 6,
    name: "Hiking Backpack 40L",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
    category: "outdoor",
    subcategory: "backpacks",
    rating: 4.6,
    inStock: true,
  },
  // {
  //   id: 7,
  //   name: "Sleeping Bag All Season",
  //   price: 79.99,
  //   image:
  //     "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop",
  //   category: "outdoor",
  //   subcategory: "sleeping",
  //   rating: 4.3,
  //   inStock: true,
  // },
  // {
  //   id: 8,
  //   name: "Portable Camp Stove",
  //   price: 89.99,
  //   image:
  //     "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop",
  //   category: "outdoor",
  //   subcategory: "cooking",
  //   rating: 4.4,
  //   inStock: true,
  // },

  // Water Sports
  {
    id: 9,
    name: "Professional Surfboard",
    price: 449.99,
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=300&h=300&fit=crop",
    category: "water",
    subcategory: "surfing",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 10,
    name: "Swimming Goggles Pro",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=300&fit=crop",
    category: "water",
    subcategory: "swimming",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 11,
    name: "Snorkeling Set",
    price: 69.99,
    image:
      "https://i.ibb.co/23pXJC0s/scuba-respiratory-safety-closeup-summertime-1.jpg",
    category: "water",
    subcategory: "diving",
    rating: 4.3,
    inStock: true,
  },
  // {
  //   id: 12,
  //   name: "Inflatable Kayak",
  //   price: 249.99,
  //   image:
  //     "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=300&h=300&fit=crop",
  //   category: "water",
  //   subcategory: "kayaking",
  //   rating: 4.2,
  //   inStock: false,
  // },

  // Additional Sports Items
  {
    id: 13,
    name: "Basketball Official Size",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=300&fit=crop",
    category: "sports",
    subcategory: "balls",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 14,
    name: "Tennis Racket Pro",
    price: 159.99,
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=300&fit=crop",
    category: "sports",
    subcategory: "rackets",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 15,
    name: "Running Shoes",
    price: 119.99,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    category: "sports",
    subcategory: "footwear",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 16,
    name: "Protein Shaker Bottle",
    price: 14.99,
    image: "https://i.ibb.co/VYbLxNMf/shaker-bottle-1.jpg",
    category: "fitness",
    subcategory: "accessories",
    rating: 4.2,
    inStock: true,
  },
];

const uploadSampleData = async () => {
  try {
    console.log("\n🚀 Starting to upload sample sports products...\n");

    for (const product of sampleProducts) {
      await setDoc(doc(db, "sports", product.id.toString()), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Uploaded: ${product.name}`);
    }

    console.log("\n🎉 All sports products uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading products:", error);
    process.exit(1);
  }
};

// Run the function
uploadSampleData();
