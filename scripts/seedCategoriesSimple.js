// seedCategoriesSimple.js
require("dotenv").config();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Categories data (simplified - no timestamps initially)
const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://example.com/images/electronics.jpg",
    description: "Latest gadgets and electronic devices",
    productCount: 150,
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Clothing & Fashion",
    slug: "clothing-fashion",
    image: "https://example.com/images/clothing.jpg",
    description: "Trendy clothes and fashion accessories",
    productCount: 89,
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    image: "https://example.com/images/home-garden.jpg",
    description: "Everything for your home and garden",
    productCount: 234,
    isActive: true,
    isFeatured: false,
  },
  {
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    image: "https://example.com/images/sports.jpg",
    description: "Sports equipment and outdoor gear",
    productCount: 167,
    isActive: true,
    isFeatured: true,
  },
];

async function seedCategories() {
  try {
    console.log("Starting to seed categories...");
    console.log("Firebase Config loaded:", {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
    });

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      console.log(
        `Adding category ${i + 1}/${categories.length}: ${category.name}`
      );

      const docRef = await addDoc(collection(db, "categories"), category);
      console.log(`✅ Added category: ${category.name} with ID: ${docRef.id}`);
    }

    console.log("🎉 All categories seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
  } finally {
    process.exit(0);
  }
}

// Run the seeder
seedCategories();
