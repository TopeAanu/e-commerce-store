// app/products/[id]/page.tsx
import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProductById,
  getRelatedProducts,
} from "../../../app/lib/firebase/products";
import { getRelatedProductItems } from "../../../app/lib/firebase/related-products-manager";
import { AddToCartButton } from "../../components/add-to-cart-button";
import ProductGrid from "../../components/product-grid";
import { RelatedProductCard } from "../../components/related-products-card";

// Fix 1: Make params async and properly type it
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  // Await params before using its properties
  const { id } = await params;

  return (
    <div className="container px-4 py-6 md:py-8">
      <Suspense
        fallback={<p className="text-center py-12">Loading product...</p>}
      >
        <ProductDetails id={id} />
      </Suspense>
    </div>
  );
}

// Helper function to sanitize Firestore documents for client components
function sanitizeProduct(product: any) {
  return {
    ...product,
    // Convert Firestore timestamps to ISO strings
    createdAt: product.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: product.updatedAt?.toDate?.()?.toISOString() || null,
    // Remove any other Firestore-specific objects
  };
}

// Helper function to sanitize related product items
function sanitizeRelatedProductItem(item: any) {
  return {
    ...item,
    // Convert Firestore timestamps to ISO strings
    createdAt: item.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: item.updatedAt?.toDate?.()?.toISOString() || null,
  };
}

async function ProductDetails({ id }: { id: string }) {
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Fix 2: Sanitize product data before passing to client components
  const sanitizedProduct = sanitizeProduct(product);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Price overlay in bottom right */}
          <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-2 rounded text-lg font-semibold">
            ${product.price.toFixed(2)}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="prose max-w-none">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="mt-4">
            {/* Pass sanitized product to client component */}
            <AddToCartButton product={sanitizedProduct} />
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <Suspense fallback={<p>Loading related products...</p>}>
          <RelatedProducts productId={id} category={product.category} />
        </Suspense>
      </div>

      {/* Related Product Items Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Related Product Items</h2>
        <Suspense fallback={<p>Loading related product items...</p>}>
          <RelatedProductItems productId={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function RelatedProducts({
  productId,
  category,
}: {
  productId: string;
  category: string;
}) {
  try {
    const products = await getRelatedProducts(productId, category);

    // Fix 2: Sanitize products array before passing to client component
    const sanitizedProducts = products.map(sanitizeProduct);

    // Use carousel layout for related products
    return <ProductGrid products={sanitizedProducts} layout="carousel" />;
  } catch (error) {
    console.error("Error getting related products:", error);

    // If the error is about missing Firestore index, show a helpful message
    if (error instanceof Error && error.message.includes("requires an index")) {
      return (
        <div className="text-center py-6">
          <p className="text-muted-foreground">
            Related products are being set up. Please check back soon.
          </p>
        </div>
      );
    }

    // For other errors, show generic message
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Unable to load related products at the moment.
        </p>
      </div>
    );
  }
}

async function RelatedProductItems({ productId }: { productId: string }) {
  try {
    const relatedProductItems = await getRelatedProductItems(productId);

    if (relatedProductItems.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-muted-foreground">
            No related product items available for this product.
          </p>
        </div>
      );
    }

    // Sanitize related product items before rendering
    const sanitizedRelatedProductItems = relatedProductItems.map(
      sanitizeRelatedProductItem
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sanitizedRelatedProductItems.map((item) => (
          <RelatedProductCard key={item.id} item={item} />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error getting related product items:", error);
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">
          Unable to load related product items at the moment.
        </p>
      </div>
    );
  }
}
