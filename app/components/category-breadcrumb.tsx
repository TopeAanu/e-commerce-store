// components/categories/CategoryBreadcrumb.tsx
import Link from "next/link";
import { Category } from "../lib/types";

interface CategoryBreadcrumbProps {
  category: Category;
}

export default function CategoryBreadcrumb({
  category,
}: CategoryBreadcrumbProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
        </li>
        <li>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </li>
        <li>
          <Link
            href="/categories"
            className="text-gray-500 hover:text-gray-700"
          >
            Categories
          </Link>
        </li>
        <li>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </li>
        <li>
          <span className="text-gray-900 font-medium" aria-current="page">
            {category.name}
          </span>
        </li>
      </ol>
    </nav>
  );
}
