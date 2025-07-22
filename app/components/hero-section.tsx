"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = 2;

  const images = [
    "https://i.ibb.co/hFbmrt3k/shopping-1-removebg-preview.png",
    "https://i.ibb.co/rKksPHbr/ecommerce2-removebg-preview.png",
  ];

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-auto min-h-[500px] overflow-hidden">
      <div className="max-w-[1010px] mx-auto h-full px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center py-8">
          {/* Text Section */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 pt-4 sm:pt-6">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent leading-tight">
                MelStore👋
              </h1>
              <p className="max-w-[600px] mx-auto lg:mx-0 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Discover our curated collection of premium products, selected to
                enhance your lifestyle, with free shipping included on all
                orders — no minimum purchase required.
              </p>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <div className="relative overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 flex justify-center"
                    >
                      <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-auto max-h-[300px] object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      currentSlide === index
                        ? "bg-green-600"
                        : "bg-gray-300 dark:bg-gray-500"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
