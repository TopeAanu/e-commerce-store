// app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import ProductGrid from "../app/components/product-grid";
import {
  getFeaturedProducts,
  getCategories, // Keep your existing function if you want to use it
} from "../app/lib/firebase/products";
import { CategoryService } from "../app/lib/category-service"; // New import
import HeroSection from "../app/components/hero-section";
import CategoryGrid from "../app/components/category-grid"; // New import

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <Suspense
            fallback={
              <p className="text-center py-12">Loading featured products...</p>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Categories */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Shop by Category
            </h2>
            <Link
              href="/categories"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all categories →
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <CategoriesPreview />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  return <ProductGrid products={products} />;
}

// New component using the CategoryService
async function CategoriesPreview() {
  const categories = await CategoryService.getAllCategories();

  if (categories.length === 0) {
    return (
      <p className="text-center py-12 text-muted-foreground">
        No categories found. Make sure your categories are properly set up in
        Firestore.
      </p>
    );
  }

  // Show only first 4 categories on homepage
  const previewCategories = categories.slice(0, 4);

  return <CategoryGrid categories={previewCategories} />;
}

// Alternative: Keep your existing simple categories grid if you prefer
// Just rename the function above to CategoriesPreviewOld and use this:
/*
async function CategoriesGrid() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <p className="text-center py-12 text-muted-foreground">
        No categories found. Make sure your products have categories assigned.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/categories/${category.toLowerCase()}`} // Updated to use new category route
          className="group relative aspect-square overflow-hidden rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-medium text-lg capitalize">{category}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
*/
