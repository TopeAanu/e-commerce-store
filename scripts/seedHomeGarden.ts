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
    description:
      "Transform your space with this stunning 3-piece modern wall art set. Features abstract geometric designs in neutral tones that complement any contemporary decor. Made with high-quality canvas and fade-resistant inks.",
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
    description:
      "Elegant ceramic table lamp with a soft linen shade that provides warm, ambient lighting. Perfect for bedrooms, living rooms, or office spaces. Features a convenient touch control and energy-efficient LED bulb included.",
    image: "https://i.ibb.co/NgPkb6x5/interior-lamp-1.jpg",
    category: "decor",
    subcategory: "lighting",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 3,
    name: "Luxury Throw Pillow",
    price: 34.99,
    description:
      "Indulge in comfort with this premium velvet throw pillow. Soft to the touch with a rich texture that adds sophistication to any sofa or bed. Includes hidden zipper closure and removable cover for easy cleaning.",
    image: "https://i.ibb.co/tMhT5y5Z/pillow.jpg",
    category: "decor",
    subcategory: "pillows",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 4,
    name: "Ceramic Vase",
    price: 45.99,
    description:
      "Handcrafted ceramic vase with a unique glazed finish that catches light beautifully. Perfect for fresh flowers or as a standalone decorative piece. Features a wide opening for easy arrangement and stable base design.",
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
    description:
      "Spacious L-shaped sectional sofa perfect for entertaining and family gatherings. Features premium fabric upholstery, deep cushions for maximum comfort, and a sturdy hardwood frame. Includes matching accent pillows.",
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
    description:
      "Solid oak dining table that seats 6 people comfortably. Features beautiful wood grain patterns and a durable finish that resists scratches and stains. Perfect centerpiece for family meals and dinner parties.",
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
    description:
      "Professional office chair designed for all-day comfort. Features adjustable lumbar support, breathable mesh back, and 360-degree swivel. Height-adjustable with smooth-rolling casters for easy mobility.",
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
    description:
      "Multifunctional storage bench with lift-up seat revealing spacious interior compartment. Perfect for storing blankets, shoes, or seasonal items. Features soft cushioned top and elegant upholstered design.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    category: "furniture",
    subcategory: "storage",
    rating: 4.3,
    inStock: true,
  },

  // Garden & Outdoor
  // {
  //   id: 9,
  //   name: "Garden Tool Set",
  //   price: 69.99,
  //   description:
  //     "Complete 10-piece garden tool set including trowel, pruning shears, weeder, and more. Made with durable stainless steel heads and comfortable ergonomic handles. Comes with convenient storage case.",
  //   image:
  //     "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
  //   category: "garden",
  //   subcategory: "tools",
  //   rating: 4.6,
  //   inStock: true,
  // },
  {
    id: 10,
    name: "Outdoor Patio Set",
    price: 599.99,
    description:
      "Weather-resistant patio furniture set includes table and 4 chairs. Made with powder-coated aluminum frame and UV-resistant fabric cushions. Perfect for outdoor dining and entertaining year-round.",
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
    description:
      "Everything you need to start your own herb garden. Includes seeds for basil, parsley, cilantro, and mint, plus biodegradable pots and organic soil. Perfect for beginners and kitchen gardening enthusiasts.",
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
    description:
      "Set of 8 solar-powered LED garden lights that automatically turn on at dusk. Weather-resistant design with stainless steel construction. No wiring required - simply stake into the ground for instant pathway lighting.",
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
    description:
      "Authentic Persian-style area rug with intricate traditional patterns. Made with high-quality synthetic fibers that are stain-resistant and easy to clean. Adds warmth and elegance to any room.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    category: "decor",
    subcategory: "rugs",
    rating: 4.7,
    inStock: true,
  },
  // {
  //   id: 14,
  //   name: "Kitchen Bar Stools",
  //   price: 159.99,
  //   description:
  //     "Set of 2 modern bar stools with adjustable height and swivel function. Features comfortable padded seats and sturdy metal base with footrest. Perfect for kitchen islands and breakfast bars.",
  //   image:
  //     "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
  //   category: "furniture",
  //   subcategory: "stools",
  //   rating: 4.4,
  //   inStock: true,
  // },
  // {
  //   id: 15,
  //   name: "Watering Can Set",
  //   price: 29.99,
  //   description:
  //     "Set of 3 decorative watering cans in different sizes. Made from galvanized steel with vintage-inspired design. Features comfortable handle and removable spout for precise watering control.",
  //   image:
  //     "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop",
  //   category: "garden",
  //   subcategory: "irrigation",
  //   rating: 4.1,
  //   inStock: true,
  // },
  {
    id: 16,
    name: "Decorative Mirror",
    price: 89.99,
    description:
      "Round decorative mirror with ornate metal frame featuring sunburst design. Creates the illusion of more space while adding glamour to any room. Easy to hang with included mounting hardware.",
    image: "https://i.ibb.co/gbzjccLr/miror2-1.jpg",
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
