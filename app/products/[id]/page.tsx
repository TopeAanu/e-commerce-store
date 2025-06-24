import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProductById,
  getRelatedProducts,
} from "../../../app/lib/firebase/products";
import { getClothingItems } from "../../../app/lib/firebase/clothing-manager";
import { AddToCartButton } from "../../components/add-to-cart-button";
import ProductGrid from "../../components/product-grid";

// Fix 1: Make params async and properly type it
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  // Await params before using its properties
  const { id } = await params;

  return (
    <div className="container px-4 py-8 md:py-12">
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

// Helper function to sanitize clothing items
function sanitizeClothingItem(item: any) {
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
    <div className="flex flex-col gap-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl font-semibold mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="mt-6">
            {/* Pass sanitized product to client component */}
            <AddToCartButton product={sanitizedProduct} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <Suspense fallback={<p>Loading related products...</p>}>
          <RelatedProducts productId={id} category={product.category} />
        </Suspense>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Clothing Items</h2>
        <Suspense fallback={<p>Loading clothing items...</p>}>
          <ClothingItems productId={id} />
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

    return <ProductGrid products={sanitizedProducts} />;
  } catch (error) {
    console.error("Error getting related products:", error);

    // If the error is about missing Firestore index, show a helpful message
    if (error instanceof Error && error.message.includes("requires an index")) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Related products are being set up. Please check back soon.
          </p>
        </div>
      );
    }

    // For other errors, show generic message
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Unable to load related products at the moment.
        </p>
      </div>
    );
  }
}

async function ClothingItems({ productId }: { productId: string }) {
  try {
    const clothingItems = await getClothingItems(productId);

    if (clothingItems.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No clothing items available for this product.
          </p>
        </div>
      );
    }

    // Sanitize clothing items before rendering
    const sanitizedClothingItems = clothingItems.map(sanitizeClothingItem);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sanitizedClothingItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow-sm">
            {item.imageUrl && (
              <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">
                  ${item.price.toFixed(2)}
                </span>
                {item.inStock && (
                  <span className="text-sm text-green-600">In Stock</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {item.size && <span>Size: {item.size}</span>}
                {item.color && <span>Color: {item.color}</span>}
                {item.material && <span>Material: {item.material}</span>}
              </div>

              {item.brand && (
                <p className="text-sm font-medium">Brand: {item.brand}</p>
              )}

              {item.sku && (
                <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error getting clothing items:", error);
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Unable to load clothing items at the moment.
        </p>
      </div>
    );
  }
}
