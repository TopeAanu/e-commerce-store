// File: scripts/relatedProducts.mjs
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

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

// Sample related products items for different products
const relatedProductItemsData = {
  id1: [
    {
      name: "Premium Wireless Headphones",
      description:
        "High-quality over-ear headphones with active noise cancellation and adjustable headband.",
      price: 65.99,
      connectivity: "Bluetooth 5.0",
      color: "Navy Blue",
      batteryLife: "30 hours",
      brand: "AudioTech",
      inStock: true,
      quantity: 15,
      sku: "AT-HEAD-NVY-WL",
      warranty: "2 years manufacturer warranty",
      imageUrl: "https://i.ibb.co/9mN43qnt/still-life-tech-device-1.jpg",
    },
    {
      name: "Star Gaming Mouse",
      description:
        "Ergonomic gaming mouse with customizable RGB star pattern and high-precision sensor.",
      price: 69.99,
      dpi: "16000 DPI",
      color: "Gray",
      connectivity: "USB-C Wired",
      brand: "GameStar",
      inStock: true,
      quantity: 12,
      sku: "GS-MOUSE-STR-RGB",
      warranty: "1 year manufacturer warranty",
      imageUrl: "https://i.ibb.co/5XHF14WV/purple-computer-mouse-1.jpg",
    },
    {
      name: "Whale Bluetooth Speaker",
      description:
        "Portable waterproof speaker with whale-inspired design and deep bass technology.",
      price: 72.99,
      batteryLife: "12 hours",
      color: "Ocean Blue",
      waterRating: "IPX7 Waterproof",
      brand: "AquaSound",
      inStock: true,
      quantity: 8,
      sku: "AS-SPEAK-WHL-BT",
      warranty: "18 months manufacturer warranty",
      imageUrl:
        "https://i.ibb.co/Xr8gvmSx/composition-smart-speaker-table-1.jpg",
    },
  ],
  id2: {
    name: "Classic White T-Shirt",
    description: "Soft and breathable cotton t-shirt for everyday wear.",
    price: 24.99,
    size: "Large",
    color: "White",
    material: "100% Cotton",
    brand: "BasicTee",
    inStock: true,
    quantity: 30,
    sku: "BT-TEE-WHT-L",
    care_instructions: "Machine wash warm, tumble dry medium",
    imageUrl: "https://i.ibb.co/white-tshirt.jpg",
  },
  id3: {
    name: "Denim Jacket",
    description: "Classic denim jacket with button closure and chest pockets.",
    price: 89.99,
    size: "Medium",
    color: "Blue Denim",
    material: "100% Cotton Denim",
    brand: "DenimCo",
    inStock: true,
    quantity: 8,
    sku: "DC-JAC-DEN-M",
    care_instructions: "Machine wash cold, hang dry",
    imageUrl: "https://i.ibb.co/denim-jacket.jpg",
  },
  id4: {
    name: "Wool Sweater",
    description: "Cozy wool sweater perfect for cold weather.",
    price: 75.5,
    size: "Small",
    color: "Charcoal Gray",
    material: "100% Merino Wool",
    brand: "WoolCraft",
    inStock: true,
    quantity: 12,
    sku: "WC-SWE-GRY-S",
    care_instructions: "Dry clean only",
    imageUrl: "https://i.ibb.co/wool-sweater.jpg",
  },
  id5: {
    name: "Cotton Polo Shirt",
    description: "Classic polo shirt with three-button placket.",
    price: 35.99,
    size: "Medium",
    color: "Forest Green",
    material: "100% Cotton Pique",
    brand: "PoloStyle",
    inStock: true,
    quantity: 20,
    sku: "PS-POL-GRN-M",
    care_instructions: "Machine wash cold, tumble dry low",
    imageUrl: "https://i.ibb.co/polo-shirt.jpg",
  },
  id6: {
    name: "Leather Jacket",
    description: "Premium leather jacket with zipper closure and side pockets.",
    price: 199.99,
    size: "Large",
    color: "Black",
    material: "Genuine Leather",
    brand: "LeatherLux",
    inStock: true,
    quantity: 5,
    sku: "LL-JAC-BLK-L",
    care_instructions: "Professional leather cleaning recommended",
    imageUrl: "https://i.ibb.co/leather-jacket.jpg",
  },
};

async function seedAllRelatedProductItems() {
  try {
    console.log(
      "Starting to seed related product items for products id1 through id6..."
    );

    for (const [productId, relatedProductData] of Object.entries(
      relatedProductItemsData
    )) {
      console.log(`\nAdding related product items to product ${productId}...`);

      // Check if relatedProductData is an array (multiple items) or single object
      if (Array.isArray(relatedProductData)) {
        // Handle multiple items for a product
        for (let i = 0; i < relatedProductData.length; i++) {
          const item = relatedProductData[i];
          const relatedProductItem = {
            ...item,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          // Reference to the related-product subcollection with different item IDs
          const relatedProductRef = doc(
            db,
            "products",
            productId,
            "related-products",
            `item${i + 1}`
          );

          await setDoc(relatedProductRef, relatedProductItem);

          console.log(
            `✓ Successfully added: ${
              item.name
            } to ${productId}/related-products/item${i + 1}`
          );
        }
      } else {
        // Handle single item for a product
        const relatedProductItem = {
          ...relatedProductData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const relatedProductRef = doc(
          db,
          "products",
          productId,
          "related-products",
          "item1"
        );
        await setDoc(relatedProductRef, relatedProductItem);

        console.log(
          `✓ Successfully added: ${relatedProductData.name} to ${productId}/related-products/item1`
        );
      }
    }

    console.log("\n🎉 All related product items seeded successfully!");
    console.log(
      "✓ Products id1 through id6 now have related-products subcollections"
    );
  } catch (error) {
    console.error("❌ Error seeding related products items:", error);
  }
}

// Run the seeding function
seedAllRelatedProductItems();
