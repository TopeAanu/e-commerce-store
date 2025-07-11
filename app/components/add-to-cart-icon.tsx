// app/components/add-to-cart-icon.tsx
"use client";
import { useState } from "react";
import { useCart } from "../../app/lib/cart-context";
import type { Product } from "../../app/lib/types";
import { useToast } from "../../components/ui/use-toast";
import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
    });
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart`,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="p-2 bg-white dark:bg-black rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
    >
      <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
}