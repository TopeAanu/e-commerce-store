export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  featured?: boolean
  inventory: number
  createdAt: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  createdAt: Date
}
