// app/categories/[categoryId]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CategoryService } from "../../lib/category-service";
import ProductGrid from "../../components/product-grid";
import CategoryBreadcrumb from "../../components/category-breadcrumb";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

async function CategoryContent({ params, searchParams }: CategoryPageProps) {
  // Await the params and searchParams
  const { categoryId } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const pageSize = 12;

  // Fetch category details
  const category = await CategoryService.getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  // Fetch products for this category
  const { products, hasMore } = await CategoryService.getProductsByCategory(
    categoryId,
    pageSize,
    currentPage > 1 ? undefined : undefined // You'd need to implement proper pagination cursor
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryBreadcrumb category={category} />

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {category.imageUrl && (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {category.productCount}{" "}
              {category.productCount === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        {category.description && (
          <p className="text-gray-700 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            This category doesn't have any products yet.
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <a
            href={`/categories/${categoryId}?page=${currentPage + 1}`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Load More Products
          </a>
        </div>
      )}
    </div>
  );
}

function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>

      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>

      {/* Products grid skeleton */}
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
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryContent {...props} />
    </Suspense>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = await CategoryService.getCategoryById(categoryId);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | Your Store`,
    description:
      category.description || `Shop ${category.name} products at Your Store`,
  };
}
