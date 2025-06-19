// hooks/useCategories.ts
"use client";

import { useState, useEffect } from "react";
import { categoryService, Category } from "../app/lib/categoryService";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCategories = (
  featured = false,
  limit?: number
): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Category[];
      if (featured) {
        data = await categoryService.getFeaturedCategories(limit);
      } else {
        data = await categoryService.getAllCategories();
        if (limit) {
          data = data.slice(0, limit);
        }
      }

      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [featured, limit]);

  const refetch = () => {
    fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    refetch,
  };
};

// Alternative hook for client-side category fetching
export const useCategoryBySlug = (slug: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.getCategoryBySlug(slug);
        setCategory(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch category"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return {
    category,
    loading,
    error,
  };
};
