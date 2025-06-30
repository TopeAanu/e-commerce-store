"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = "" }) => {
  const pathname = usePathname();
  const categories = [
    {
      label: "Clothing & Fashion",
      href: "/categories/clothing-fashion",
    },
    {
      label: "Electronics",
      href: "/categories/electronics",
    },
    {
      label: "Home & Garden",
      href: "/categories/home-garden",
    },
    {
      label: "Sports & Outdoors",
      href: "/categories/sports-outdoors",
    },
  ];

  return (
    <nav
      className={`bg-gray-50 dark:bg-black dark:border-gray-700 ${className}`}
      aria-label="Category Navigation"
    >
      <div className="container mx-auto px-0 py-6">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          {/* Categories */}
          {categories.map((category, index) => {
            const isActive = pathname === category.href;

            return (
              <React.Fragment key={category.href}>
                <Link
                  href={category.href}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-green-600 dark:text-green-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  }`}
                >
                  {category.label}
                </Link>
                {index < categories.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
