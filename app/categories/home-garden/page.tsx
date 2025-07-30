// app/categories/home-garden/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import type { Product } from "../../lib/types";
import CategoryProductGrid from "../../components/category-product-grid";
import { useRouter } from "next/navigation";

const HomeGardenPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "home");
        const querySnapshot = await getDocs(productsRef);

        const fetchedProducts: Product[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
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
          };
        });

        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching home & garden products:", err);
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
      title="Home & Garden"
      showBreadcrumbs={true}
      onRetry={() => window.location.reload()}
      onProductClick={(id) => router.push(`/home-garden/${id}`)}
    />
  );
};

export default HomeGardenPage;
