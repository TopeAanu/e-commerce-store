// app/categories/[slug]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categoryService } from "../../lib/categoryService";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Define Product interface (you'll want to move this to a shared types file)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
}

// Loading component
const CategoryLoading = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          <div>
            <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-64 mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
            <div className="h-48 bg-gray-300 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Category content component
const CategoryContent = async ({ slug }: { slug: string }) => {
  try {
    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
      notFound();
    }

    // Get products for this category - properly typed as Product[]
    // const products = await productService.getProductsByCategory(category.id);
    const products: Product[] = []; // Placeholder until you implement product fetching

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Category Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-4">
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {category.name}
                </h1>
                <p className="text-gray-600 mt-1">{category.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {category.productCount || products.length} products available
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Products Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Products
            </h2>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.image || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No products found in this category yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    notFound();
  }
};

// Main page component
export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent slug={params.slug} />
    </Suspense>
  );
}

// Generate static params for static generation
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

// Generate metadata
export async function generateMetadata({ params }: CategoryPageProps) {
  try {
    const category = await categoryService.getCategoryBySlug(params.slug);

    if (!category) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      };
    }

    return {
      title: `${category.name} - Shop Now`,
      description: category.description,
      openGraph: {
        title: category.name,
        description: category.description,
        images: [category.image],
      },
    };
  } catch (error) {
    return {
      title: "Category",
      description: "Shop our categories",
    };
  }
}
