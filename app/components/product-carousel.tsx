// app/components/product-carousel.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "../../app/lib/types";

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(2); // Mobile: 2 items
      } else {
        setItemsPerView(4); // Desktop: 4 items
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate total slides
  const totalSlides = Math.ceil(products.length / itemsPerView);

  // Handle navigation
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-scroll functionality (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, totalSlides]);

  // Get current visible products
  const startIndex = currentIndex * itemsPerView;
  const visibleProducts = products.slice(startIndex, startIndex + itemsPerView);

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products available.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel Container with Navigation */}
      <div className="relative">
        {/* Navigation Buttons - positioned to center with images only */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-[-1rem] top-[40%] -translate-y-1/2 z-10 bg-white/60 hover:bg-white/80 shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5 transition-transform duration-200" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-[-1rem] top-[40%] -translate-y-1/2 z-10 bg-white/60 hover:bg-white/80 shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5 transition-transform duration-200" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div ref={carouselRef} className="overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-0">
                  {products
                    .slice(
                      slideIndex * itemsPerView,
                      (slideIndex + 1) * itemsPerView
                    )
                    .map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="group"
                      >
                        <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={
                              product.imageUrl ||
                              "/placeholder.svg?height=400&width=400"
                            }
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          {/* Price overlay */}
                          <div className="absolute bottom-1 right-1 bg-green-600 text-white px-2 py-1 rounded-md">
                            <p className="text-xs font-medium">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="font-medium text-sm truncate">
                            {product.name}
                          </h3>
                          {/* <p className="text-xs text-muted-foreground truncate">
                            {product.category}
                          </p> */}
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
