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
    description:
      "Light and breezy floral print dress perfect for summer occasions. Features a flattering A-line silhouette with adjustable straps and a midi length.",
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
    description:
      "Timeless white button-down blouse made from premium cotton. Versatile piece that pairs well with skirts, pants, or jeans for both professional and casual looks.",
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
    description:
      "Flattering high-waisted denim jeans with a comfortable stretch fit. Classic blue wash with subtle distressing and a slim-fit silhouette that elongates the legs.",
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
    description:
      "Genuine leather moto jacket with silver hardware and quilted detailing. A wardrobe staple that adds edge to any outfit, featuring zip pockets and a fitted cut.",
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
    description:
      "Classic fit polo shirt made from 100% cotton piqué. Features a three-button placket and ribbed collar and cuffs. Available in multiple colors for versatile styling.",
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
    description:
      "Tailored chino pants in a modern slim fit. Made from premium cotton twill with a clean finish, perfect for both casual and smart-casual occasions.",
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
    description:
      "Sophisticated two-piece suit in navy blue wool blend. Features a modern tailored fit with notch lapels, two-button closure, and matching trousers with flat front.",
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
    description:
      "Comfortable pullover hoodie made from soft cotton blend fleece. Features a drawstring hood, kangaroo pocket, and relaxed fit perfect for everyday casual wear.",
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
    description:
      "Clean and minimalist white leather sneakers with rubber sole. Versatile design that complements both casual and smart-casual outfits. Comfortable all-day wear.",
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
    description:
      "Elegant structured handbag crafted from premium leather. Features multiple compartments, adjustable shoulder strap, and gold-tone hardware. Perfect for work or special occasions.",
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
    description:
      "Luxury timepiece with gold-plated stainless steel case and bracelet. Features a classic round face with Roman numeral markers and precise quartz movement.",
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
    description:
      "Classic leather belt with polished metal buckle. Made from genuine leather with a smooth finish, perfect for both casual and formal wear. Available in multiple sizes.",
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
