import { Suspense } from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import ProductGrid from "../app/components/product-grid";
import { getFeaturedProducts } from "../app/lib/firebase/products";
import { ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to NextShop
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Discover our curated collection of products with free shipping
                on all orders.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <Suspense
            fallback={
              <p className="text-center py-12">Loading featured products...</p>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Categories */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {["Electronics", "Clothing", "Home", "Beauty"].map((category) => (
              <Link
                key={category}
                href={`/products?category=${category.toLowerCase()}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-medium text-lg">{category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return <ProductGrid products={products} />;
}
