"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Duplicate the same image for carousel
  const images = [
    "https://i.ibb.co/hFbmrt3k/shopping-1-removebg-preview.png",
    "https://i.ibb.co/hFbmrt3k/shopping-1-removebg-preview.png",
    "https://i.ibb.co/hFbmrt3k/shopping-1-removebg-preview.png",
  ];

  // Auto-slide functionality with longer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative w-screen h-[70vh] min-h-[500px] -mx-[50vw] left-1/2 right-1/2">
      <div className="max-w-[1010px] mx-auto h-full px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center h-full py-8">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 pt-4 sm:pt-6">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent leading-tight">
                MelStore👋
              </h1>
              <p className="max-w-[600px] mx-auto lg:mx-0 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Discover our curated collection of premium products, selected to
                enhance your lifestyle, with free shipping included on all
                orders, no minimum purchase required.
              </p>
            </div>
          </div>

          {/* Right side - Image Carousel */}
          <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2 pb-0 -mb-4">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {images.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <img
                        src={image}
                        alt={`Shopping experience ${index + 1}`}
                        className="w-full h-auto rounded-lg object-cover transition-opacity duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
