// app/components/product-grid.tsx
import Link from "next/link";
import Image from "next/image";
import ProductCarousel from "./product-carousel";
import type { Product } from "../../app/lib/types";

interface ProductGridProps {
  products: Product[];
  layout?: "grid" | "carousel";
}

export default function ProductGrid({
  products,
  layout = "carousel",
}: ProductGridProps) {
  if (layout === "carousel") {
    return <ProductCarousel products={products} />;
  }

  // Original grid layout (fallback)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group"
        >
          <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="mt-3">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <p className="mt-1 font-medium">${product.price.toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// // components/products/ProductGrid.tsx
// import { Product } from '@/lib/types/category';
// import ProductCard from './ProductCard';

// interface ProductGridProps {
//   products: Product[];
// }

// export default function ProductGrid({ products }: ProductGridProps) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))}
//     </div>
//   );
// }
