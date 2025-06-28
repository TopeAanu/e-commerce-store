// components/ShopByCategory.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount?: number;
}

interface ShopByCategoryProps {
  categories: Category[];
  title?: string;
  className?: string;
}

const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  categories,
  title = "Shop by Category",
  className = "",
}) => {
  if (!categories || categories.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            {title}
          </h2>
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No categories available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 bg-gray-50 dark:bg-black ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover our wide range of products organized by categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="bg-white dark:bg-black rounded- shadow-md dark:shadow-gray-700/50 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-700/70 transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {category.productCount !== undefined && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {category.productCount}{" "}
                      {category.productCount === 1 ? "product" : "products"}
                    </p>
                  )}

                  <div className="mt-3 flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                    Shop Now
                    <svg
                      className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
