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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setItemsPerView(mobile ? 2 : 4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

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
    const threshold = 50;
    if (Math.abs(diffX) > threshold) {
      diffX > 0 ? goToNext() : goToPrev();
    }
    isDragging.current = false;
  };

  const totalSlides = Math.ceil(products.length / itemsPerView);

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products available.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Chevron Navigation */}
      {!isMobile && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute left-[-1rem] top-[40%] -translate-y-1/2 z-10 bg-white/60 hover:bg-white/80 shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {currentIndex < maxIndex && (
            <button
              onClick={goToNext}
              className="absolute right-[-1rem] top-[40%] -translate-y-1/2 z-10 bg-white/60 hover:bg-white/80 shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </>
      )}

      {/* Carousel */}
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

      {/* Mobile Dots */}
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
