import { collection, addDoc, doc, getDoc, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "./config"
import type { Order, CartItem } from "../types"

// Create a new order
export const createOrder = async (orderData: {
  userId: string
  items: CartItem[]
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  status: string
  total: number
  createdAt: Date
}): Promise<{ id: string }> => {
  try {
    const docRef = await addDoc(collection(db, "orders"), orderData)
    return { id: docRef.id }
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

// Get orders for a user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[]
  } catch (error) {
    console.error("Error getting user orders:", error)
    return []
  }
}

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, "orders", orderId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order
    }

    return null
  } catch (error) {
    console.error("Error getting order:", error)
    return null
  }
}
