// app/categories/home-garden/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import { AddToCartButton } from "../../components/add-to-cart-icon";
import type { Product } from "../../lib/types";
import Breadcrumbs from "../../components/breadcrumbs";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  // Handle product click navigation
  const handleProductClick = (productId: string) => {
    router.push(`/product-details-home/${productId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
      <div className="container mx-auto px-0">
        {/* <Breadcrumbs /> */}
        {/* Header Section */}
        <div className="text-left mb-2">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Home & Garden
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                {/* Make image clickable */}
                <img
                  src={product.imageUrl || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleProductClick(product.id)}
                />
                {!product.inStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Out of Stock
                  </div>
                )}

                {/* Cart Icon - Left Bottom */}
                {product.inStock && (
                  <div className="absolute bottom-2 left-2 z-10">
                    <AddToCartButton product={product} />
                  </div>
                )}

                {/* Price - Right Bottom */}
                <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                  ${product.price}
                </div>
              </div>

              <div className="p-2">
                {/* Make product name clickable */}
                <h3
                  className="font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate cursor-pointer hover:text-green-600 transition-colors"
                  onClick={() => handleProductClick(product.id)}
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

export default HomeGardenPage;
