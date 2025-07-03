"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import { Input } from "../../components/ui/input";
import { Search, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { getCategories } from "../../app/lib/firebase/products";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  // Memoize URL parameter values to prevent unnecessary re-renders
  const urlCategories = useMemo(() => {
    const categoryParam = searchParams.get("category");
    return categoryParam ? categoryParam.split(",") : [];
  }, [searchParams.get("category")]);

  const urlPriceRange = useMemo(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice && maxPrice) {
      return [Number.parseInt(minPrice), Number.parseInt(maxPrice)];
    }
    return [0, 1000];
  }, [searchParams.get("minPrice"), searchParams.get("maxPrice")]);

  const urlSearchQuery = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams.get("search")]);

  // Initialize state from URL params only once or when URL actually changes
  useEffect(() => {
    setSelectedCategories(urlCategories);
  }, [urlCategories]);

  useEffect(() => {
    setPriceRange(urlPriceRange);
  }, [urlPriceRange]);

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
      setFilteredCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  // Create query string
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Handle search change with debouncing to prevent too many URL updates
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update URL with search parameter
    router.push(
      `/products?${createQueryString({
        search: value || null,
      })}`
    );
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    router.push(
      `/products?${createQueryString({
        search: null,
      })}`
    );
  };

  // Handle category change
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);

    setSelectedCategories(newCategories);

    router.push(
      `/products?${createQueryString({
        category: newCategories.length > 0 ? newCategories.join(",") : null,
      })}`
    );
  };

  // Handle price change (only update local state, not URL immediately)
  const handlePriceChange = useCallback((values: number[]) => {
    // Add validation to prevent invalid values
    if (
      Array.isArray(values) &&
      values.length === 2 &&
      typeof values[0] === "number" &&
      typeof values[1] === "number"
    ) {
      setPriceRange(values);
    }
  }, []);

  // Apply price filter (only update URL when user explicitly applies)
  const applyPriceFilter = () => {
    router.push(
      `/products?${createQueryString({
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      })}`
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
    router.push("/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["categories", "price"]}
        className="w-full"
      >
        <AccordionItem value="categories">
          <AccordionTrigger>
            Categories {searchQuery && `(${filteredCategories.length} found)`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category, checked === true)
                      }
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No categories found matching "{searchQuery}"
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {/* Temporary replacement for problematic slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Min: ${priceRange[0]}</span>
                  <span>Max: ${priceRange[1]}</span>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const newMin = Math.max(0, Number(e.target.value) || 0);
                      setPriceRange([newMin, priceRange[1]]);
                    }}
                    className="w-20"
                  />
                  <span className="self-center">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newMax = Math.min(
                        1000,
                        Number(e.target.value) || 1000
                      );
                      setPriceRange([priceRange[0], newMax]);
                    }}
                    className="w-20"
                  />
                </div>
              </div>
              <Button size="sm" onClick={applyPriceFilter}>
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
