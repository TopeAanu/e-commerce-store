import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProductById,
  getRelatedProducts,
} from "../../../app/lib/firebase/products";
import { AddToCartButton } from "../../components/add-to-cart-button";
import ProductGrid from "../../components/product-grid";

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container px-4 py-8 md:py-12">
      <Suspense
        fallback={<p className="text-center py-12">Loading product...</p>}
      >
        <ProductDetails id={params.id} />
      </Suspense>
    </div>
  );
}

async function ProductDetails({ id }: { id: string }) {
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

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
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <Suspense fallback={<p>Loading related products...</p>}>
          <RelatedProducts productId={id} category={product.category} />
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
  const products = await getRelatedProducts(productId, category);

  return <ProductGrid products={products} />;
}
