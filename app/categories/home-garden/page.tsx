// app/categories/home-garden/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import { AddToCartButton } from "../../components/add-to-cart-button";
import type { Product } from "../../lib/types";

// Firestore document structure
interface FirestoreProduct {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  inStock: boolean;
}

const HomeGardenPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Firestore product to Product type
  const convertToProduct = (
    firestoreProduct: FirestoreProduct,
    docId: string
  ): Product => {
    return {
      id: firestoreProduct.id?.toString() || docId,
      name: firestoreProduct.name,
      description: `${firestoreProduct.category} - ${firestoreProduct.subcategory}`, // Create description from category/subcategory
      price: firestoreProduct.price,
      category: firestoreProduct.category,
      imageUrl: firestoreProduct.image,
      inventory: firestoreProduct.inStock ? 100 : 0, // Default inventory
      inStock: firestoreProduct.inStock,
      createdAt: new Date().toISOString(),
      rating: firestoreProduct.rating,
      reviewCount: Math.floor(Math.random() * 100) + 1, // Mock review count
    };
  };

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch all products from 'home' collection
        const productsRef = collection(db, "home");

        // Option with query filters (uncomment if needed)
        // const productsRef = query(
        //   collection(db, "home"),
        //   where("category", "in", ["women", "men", "accessories"]),
        //   orderBy("name")
        // );

        const querySnapshot = await getDocs(productsRef);
        const fetchedProducts: Product[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as FirestoreProduct;
          const product = convertToProduct(data, doc.id);
          fetchedProducts.push(product);
        });

        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ☆
        </span>
      );
    }

    return stars;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400">
              Loading products...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No products found
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
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
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.imageUrl || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {!product.inStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate">
                  {product.name}
                </h3>

                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(product.rating || 0)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.rating || 0})
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-lg font-bold text-purple-600">
                    ${product.price}
                  </span>
                </div>

                {/* Replace the simple button with AddToCartButton component */}
                {product.inStock ? (
                  <AddToCartButton product={product} />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center py-2">
                      <span className="text-gray-500 text-sm">
                        Out of Stock
                      </span>
                    </div>
                    <button
                      className="w-full px-4 py-2 bg-gray-300 text-gray-500 cursor-not-allowed rounded-md text-sm font-medium"
                      disabled
                    >
                      Unavailable
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeGardenPage;
