// app/categories/page.tsx (or pages/categories.tsx for Pages Router)
import { Suspense } from "react";
import { categoryService } from "../lib/categoryService";
import ShopByCategory from "../../components/ShopByCategory";

// Loading component
const CategoriesLoading = () => (
  <section className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-300 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Categories component that fetches data
const CategoriesContent = async () => {
  try {
    const categories = await categoryService.getAllCategories();
    return <ShopByCategory categories={categories} />;
  } catch (error) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <div className="text-red-600 mb-4">
            <p>Sorry, we couldn't load categories at the moment.</p>
            <p className="text-sm text-gray-500">
              Please try refreshing the page.
            </p>
          </div>
        </div>
      </section>
    );
  }
};

// Main page component
export default function CategoriesPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<CategoriesLoading />}>
        <CategoriesContent />
      </Suspense>
    </main>
  );
}

// For static generation (optional - if you want to pre-render)
export async function generateStaticParams() {
  try {
    const categories = await categoryService.getAllCategories();
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
