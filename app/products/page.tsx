"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductFilters from "../../app/components/product-filters"; // Adjust import path
import { productService, Product } from "../lib/product-service"; // Adjust import path

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search parameters - FIXED: Memoize these to prevent new array creation
  const searchTerm = searchParams.get("search") || "";
  const selectedCategories = useMemo(() => {
    const categoryParam = searchParams.get("category");
    return categoryParam ? categoryParam.split(",") : [];
  }, [searchParams.get("category")]);

  const minPrice = useMemo(() => {
    return Number(searchParams.get("minPrice")) || 0;
  }, [searchParams.get("minPrice")]);

  const maxPrice = useMemo(() => {
    return Number(searchParams.get("maxPrice")) || 1000;
  }, [searchParams.get("maxPrice")]);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Replace this with your actual product fetching function
        const fetchedProducts = await fetchAllProducts(); // You need to implement this
        setProducts(fetchedProducts);
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search parameters
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategories, minPrice, maxPrice]);

  // Placeholder function - replace with your actual product fetching logic
  const fetchAllProducts = async (): Promise<Product[]> => {
    return await productService.getAllProducts();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex">
          <div className="w-1/4 pr-8">
            <ProductFilters />
          </div>
          <div className="w-3/4">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading products...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex">
          <div className="w-1/4 pr-8">
            <ProductFilters />
          </div>
          <div className="w-3/4">
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        {searchTerm && (
          <p className="text-gray-600 mt-2">
            Searching for: "{searchTerm}" ({filteredProducts.length} results)
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-1/4">
          <ProductFilters />
        </div>

        {/* Products Grid */}
        <div className="w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `No products match "${searchTerm}"`
                  : "No products match your current filters"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.category}
                      </span>
                    </div>
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Summary */}
          {filteredProducts.length > 0 && (
            <div className="mt-8 text-center text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
