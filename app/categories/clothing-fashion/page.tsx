// app/categories/clothing-fashion/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import type { Product } from "../../lib/types";
import CategoryProductGrid from "../../components/category-product-grid";

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

const ClothingFashionPage = () => {
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
      description: `${firestoreProduct.category} - ${firestoreProduct.subcategory}`,
      price: firestoreProduct.price,
      category: firestoreProduct.category,
      imageUrl: firestoreProduct.image,
      inventory: firestoreProduct.inStock ? 100 : 0,
      inStock: firestoreProduct.inStock,
      createdAt: new Date().toISOString(),
      rating: firestoreProduct.rating,
      reviewCount: Math.floor(Math.random() * 100) + 1,
    };
  };

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "clothing");
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

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <CategoryProductGrid
      products={products}
      loading={loading}
      error={error}
      title="Clothing"
      onRetry={handleRetry}
      gridCols={{ default: 2, sm: 4, lg: 6 }}
      showBreadcrumbs={false}
    />
  );
};

export default ClothingFashionPage;
