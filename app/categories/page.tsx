// app/categories/page.tsx
import { Suspense } from "react";
import { CategoryService } from "../lib/category-service";
import CategoryGrid from "../components/category-grid";
import { Category } from "../lib/types";

async function CategoriesContent() {
  const categories = await CategoryService.getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Shop by Category
        </h1>
        <p className="text-gray-600">
          Browse our wide selection of products by category
        </p>
      </div>

      <CategoryGrid categories={categories} />
    </div>
  );
}

function CategoriesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesContent />
    </Suspense>
  );
}

export async function generateMetadata() {
  return {
    title: "Shop by Category | Your Store",
    description:
      "Browse our wide selection of products organized by categories",
  };
}
