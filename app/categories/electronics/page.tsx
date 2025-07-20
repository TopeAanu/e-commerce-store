// app/categories/electronics/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import type { Product } from "../../lib/types";
import CategoryProductGrid from "../../components/category-product-grid";

const ElectronicsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "electronics");
        const querySnapshot = await getDocs(productsRef);
        const fetchedProducts: Product[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data() as any;
          fetchedProducts.push({
            id: doc.id,
            name: data.name,
            description: `${data.category} - ${data.subcategory}`,
            price: data.price,
            category: data.category,
            imageUrl: data.image,
            inventory: data.inStock ? 100 : 0,
            inStock: data.inStock,
            createdAt: new Date().toISOString(),
            rating: data.rating,
            reviewCount: Math.floor(Math.random() * 100) + 1,
          });
        });

        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <CategoryProductGrid
      products={products}
      loading={loading}
      error={error}
      title="Electronics"
      showBreadcrumbs={true}
      onRetry={() => window.location.reload()}
    />
  );
};

export default ElectronicsPage;
