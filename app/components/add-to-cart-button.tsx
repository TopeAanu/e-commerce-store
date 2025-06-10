"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { useCart } from "../../app/lib/cart-context";
import type { Product } from "../../app/lib/types";
import { useToast } from "../../components/ui/use-toast";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

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
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={decrementQuantity}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button variant="outline" size="icon" onClick={incrementQuantity}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button className="w-full" onClick={handleAddToCart}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>
    </div>
  );
}
