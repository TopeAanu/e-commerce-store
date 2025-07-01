"use client";

import Image from "next/image";
import { useCart } from "../lib/cart-context";
import { ShoppingCart } from "lucide-react";

interface RelatedProductCardProps {
  item: any;
}

export function RelatedProductCard({ item }: RelatedProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Explicitly pass quantity of 1
    addToCart({ ...item, quantity: 1 });
    console.log(`${item.name} added to cart`);
  };

  return (
    <div className="border rounded-lg p-3 shadow-sm">
      {item.imageUrl && (
        <div className="aspect-square relative mb-3 overflow-hidden rounded-lg bg-muted group">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Add to cart icon - bottom left */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 left-2 bg-gray-600 hover:bg-white-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-90 hover:opacity-100 hover:scale-110"
            aria-label={`Add ${item.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>

          {/* Price overlay - bottom right */}
          <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
            ${item.price.toFixed(2)}
          </div>
        </div>
      )}

      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>

        {/* <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {item.size && <span>Size: {item.size}</span>}
          {item.color && <span>Color: {item.color}</span>}
          {item.material && <span>Material: {item.material}</span>}
        </div> */}

        {/* {item.brand && (
          <p className="text-sm font-medium">Brand: {item.brand}</p>
        )} */}

        {/* {item.sku && (
          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
        )} */}
      </div>
    </div>
  );
}
