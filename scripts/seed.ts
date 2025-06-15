// scripts/seed.ts
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase-config";

// Sample products data
const productsData = [
  // Electronics
  {
    name: "iPhone 15 Pro",
    description: "Latest iPhone with advanced camera system and A17 Pro chip",
    price: 999.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    inStock: true,
    featured: true,
  },
  {
    name: "MacBook Air M2",
    description: "Thin, light, and powerful laptop with M2 chip",
    price: 1199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    inStock: true,
    featured: false,
  },
  {
    name: "Sony WH-1000XM4",
    description: "Industry-leading noise canceling wireless headphones",
    price: 279.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    inStock: true,
    featured: true,
  },

  // Clothing
  {
    name: "Classic White T-Shirt",
    description: "Premium cotton t-shirt for everyday comfort",
    price: 29.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    inStock: true,
    featured: false,
  },
  {
    name: "Denim Jacket",
    description: "Vintage-style denim jacket perfect for any season",
    price: 89.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400",
    inStock: true,
    featured: true,
  },
  {
    name: "Running Shoes",
    description: "Comfortable and lightweight running shoes",
    price: 129.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    inStock: true,
    featured: false,
  },

  // Books
  {
    name: "The Complete Guide to JavaScript",
    description: "Master modern JavaScript with this comprehensive guide",
    price: 49.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    inStock: true,
    featured: true,
  },
  {
    name: "Design Patterns",
    description: "Essential book for software developers",
    price: 39.99,
    category: "Books",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    inStock: true,
    featured: false,
  },

  // Home & Garden
  {
    name: "Indoor Plant Set",
    description: "Beautiful collection of low-maintenance indoor plants",
    price: 79.99,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    inStock: true,
    featured: true,
  },
  {
    name: "Coffee Maker",
    description: "Premium automatic coffee maker with grinder",
    price: 199.99,
    category: "Home & Garden",
    image: "https://i.ibb.co/nqMXH9Vh/tshirt-1.jpg",
    inStock: true,
    featured: false,
  },
];

// Sample categories data
const categoriesData = [
  {
    name: "Electronics",
    showcaseImage:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
  },
  {
    name: "Clothing",
    showcaseImage:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
  },
  {
    name: "Books",
    showcaseImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
  },
  {
    name: "Home & Garden",
    showcaseImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
  },
];

async function seedCategories() {
  try {
    console.log("🌱 Seeding categories...");

    for (const category of categoriesData) {
      await addDoc(collection(db, "categories"), category);
      console.log(`✅ Added category: ${category.name}`);
    }

    console.log("✅ Categories seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
}

async function seedProducts() {
  try {
    console.log("🌱 Seeding products...");

    for (const product of productsData) {
      await addDoc(collection(db, "products"), product);
      console.log(`✅ Added product: ${product.name}`);
    }

    console.log("✅ Products seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

async function runSeed() {
  try {
    console.log("🌱 Starting database seeding...");
    await seedCategories();
    await seedProducts();
    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

runSeed();
