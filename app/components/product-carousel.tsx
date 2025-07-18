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
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setItemsPerView(2); // Mobile: 2 items
      } else {
        setItemsPerView(4); // Desktop: 4 items
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate max index (how far we can scroll)
  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Handle navigation - continue from beginning when reaching end
  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging.current) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || !isDragging.current) return;

    const endX = e.changedTouches[0].clientX;
    const diffX = startX.current - endX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left - go to next
        goToNext();
      } else {
        // Swipe right - go to previous
        goToPrev();
      }
    }

    isDragging.current = false;
  };

  // Get current visible products
  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  // Calculate total slides for mobile dots
  const totalSlides = Math.ceil(products.length / itemsPerView);
  const currentSlide = Math.floor(currentIndex / itemsPerView);

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
        {/* Desktop Navigation Buttons */}
        {!isMobile && (
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
        <div
          ref={carouselRef}
          className="overflow-hidden rounded-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${(currentIndex / itemsPerView) * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 px-2 md:px-0">
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
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Dots Navigation */}
      {isMobile && products.length > itemsPerView && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerView)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / itemsPerView) === index
                  ? "bg-green-600 w-4"
                  : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
