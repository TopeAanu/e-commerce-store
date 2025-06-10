// This script seeds the Firebase Firestore database with sample products
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "Electronics",
    featured: true,
    inventory: 50,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    category: "Clothing",
    featured: false,
    inventory: 100,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Smart Home Security Camera",
    description: "1080p HD security camera with night vision and mobile app integration.",
    price: 149.99,
    category: "Electronics",
    featured: true,
    inventory: 25,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 handcrafted ceramic coffee mugs perfect for your morning routine.",
    price: 39.99,
    category: "Home",
    featured: false,
    inventory: 75,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Natural Face Moisturizer",
    description: "Hydrating face moisturizer made with natural ingredients for all skin types.",
    price: 24.99,
    category: "Beauty",
    featured: true,
    inventory: 60,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip premium yoga mat with extra cushioning for comfortable practice.",
    price: 79.99,
    category: "Sports",
    featured: false,
    inventory: 40,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours.",
    price: 34.99,
    category: "Home",
    featured: true,
    inventory: 80,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Wireless Phone Charger",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 49.99,
    category: "Electronics",
    featured: false,
    inventory: 35,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Denim Jacket Classic",
    description: "Timeless denim jacket made from premium denim with a comfortable fit.",
    price: 89.99,
    category: "Clothing",
    featured: true,
    inventory: 30,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Essential Oil Diffuser",
    description: "Ultrasonic essential oil diffuser with LED lights and timer settings.",
    price: 59.99,
    category: "Home",
    featured: false,
    inventory: 45,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Vitamin C Serum",
    description: "Brightening vitamin C serum that helps reduce dark spots and improve skin texture.",
    price: 32.99,
    category: "Beauty",
    featured: true,
    inventory: 55,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
  {
    name: "Bluetooth Speaker Portable",
    description: "Compact waterproof Bluetooth speaker with 12-hour battery life.",
    price: 69.99,
    category: "Electronics",
    featured: false,
    inventory: 65,
    imageUrl: "/placeholder.svg?height=400&width=400",
    createdAt: new Date().toISOString(),
  },
]

async function clearProducts() {
  console.log("Clearing existing products...")
  const querySnapshot = await getDocs(collection(db, "products"))
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref))
  await Promise.all(deletePromises)
  console.log(`Deleted ${querySnapshot.docs.length} existing products.`)
}

async function seedProducts() {
  try {
    console.log("Starting to seed products...")

    // Clear existing products first
    await clearProducts()

    // Add new products
    const addPromises = sampleProducts.map((product) => addDoc(collection(db, "products"), product))

    await Promise.all(addPromises)

    console.log(`Successfully seeded ${sampleProducts.length} products to Firestore!`)
    console.log("Products added:")
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`)
    })
  } catch (error) {
    console.error("Error seeding products:", error)
  }
}

// Run the seeding function
seedProducts()
