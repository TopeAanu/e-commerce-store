"use client";

import React from "react";
import { AddToCartButton } from "./add-to-cart-icon";
import type { Product } from "../lib/types";
import { useRouter } from "next/navigation";

interface CategoryProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  onRetry?: () => void;
  gridCols?: {
    default: number;
    sm: number;
    lg: number;
  };
  showBreadcrumbs?: boolean;
  className?: string;
  onProductClick?: (id: string) => void; // ✅ Added prop
}

const CategoryProductGrid: React.FC<CategoryProductGridProps> = ({
  products,
  loading = false,
  error = null,
  title,
  onRetry,
  gridCols = { default: 2, sm: 4, lg: 6 },
  showBreadcrumbs = false,
  className = "",
  onProductClick, // ✅ Destructured prop
}) => {
  const router = useRouter();

  const handleImageClick = (productId: string) => {
    if (onProductClick) {
      onProductClick(productId); // ✅ Use provided handler
    } else {
      router.push(`/product-details/${productId}`); // ✅ Fallback
    }
  };

  const gridColsClass = `grid-cols-${gridCols.default} sm:grid-cols-${gridCols.sm} lg:grid-cols-${gridCols.lg}`;

  if (loading) {
    return (
      <div className="bg-white dark:bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No products found
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-black py-6 ${className}`}>
      <div className="container mx-auto px-0">
        {showBreadcrumbs && <div className="mb-4">{/* <Breadcrumbs /> */}</div>}

        {title && (
          <div className="text-left mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {title}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-black rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.imageUrl || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="w-full aspect-[4/3] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(product.id)}
                />
                {!product.inStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Out of Stock
                  </div>
                )}
                {product.inStock && (
                  <div className="absolute bottom-2 left-2">
                    <AddToCartButton product={product} />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                  ${product.price}
                </div>
              </div>
              <div className="p-0">
                <h3
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate cursor-pointer"
                  onClick={() => handleImageClick(product.id)}
                >
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryProductGrid;
