// app/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import ProductGrid from "../app/components/product-grid";
import { getFeaturedProducts } from "../app/lib/firebase/products";
import { categoryService } from "../app/lib/categoryService";
import HeroSection from "../app/components/hero-section";
// import ShopByCategory from "../components/ShopByCategory";
import { sanitizeProducts } from "../app/lib/sanitize-products";
import ClothingFashionPage from "./categories/clothing-fashion/page";
import ElectronicsPage from "./categories/electronics/page";
import HomeGardenPage from "./categories/home-garden/page";
import SportsOutdoorsPage from "./categories/sports-outdoors/page";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
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

      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <ClothingFashionPage />
          <ElectronicsPage />
          <HomeGardenPage />
          <SportsOutdoorsPage />
        </div>
      </section>

      {/* Categories Section - Using the categories page logic */}
      <section className="py-0 bg-gray-50">
        <div className="container mx-auto px-0">
          {/* <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Shop by Category
              </h2>
              <Link
                href="/categories"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all →
              </Link>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our wide selection of products organized by category
            </p>
          </div> */}
          <Suspense fallback={<CategoriesLoading />}>
            <CategoriesPreview />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function FeaturedProducts() {
  try {
    const products = await getFeaturedProducts();

    // ✅ CRITICAL FIX: Sanitize products before passing to client component
    const sanitizedProducts = sanitizeProducts(products);

    return <ProductGrid products={sanitizedProducts} />;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Unable to load featured products at the moment.
        </p>
      </div>
    );
  }
}

// Loading component from categories page
const CategoriesLoading = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-48 bg-gray-300 animate-pulse"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

// Categories content from categories page - modified for homepage preview
const CategoriesPreview = async () => {
  try {
    const categories = await categoryService.getAllCategories();

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

    // return <ShopByCategory categories={previewCategories} />;
  } catch (error) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">
          <p>Sorry, we couldn't load categories at the moment.</p>
          <p className="text-sm text-gray-500">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
};
