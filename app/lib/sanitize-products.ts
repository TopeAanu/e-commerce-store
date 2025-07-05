// app/lib/utils/sanitize-products.ts
import type { Product } from "../lib/types";

/**
 * Sanitizes a single product by converting Firestore timestamps to ISO strings
 */
export function sanitizeProduct(product: any): Product {
  return {
    ...product,
    // Convert Firestore timestamps to ISO strings
    createdAt: product.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: product.updatedAt?.toDate?.()?.toISOString() || null,
    // Remove any other Firestore-specific objects if they exist
  };
}

/**
 * Sanitizes an array of products
 */
export function sanitizeProducts(products: any[]): Product[] {
  return products.map(sanitizeProduct);
}

/**
 * Sanitizes related product items
 */
export function sanitizeRelatedProductItem(item: any) {
  return {
    ...item,
    // Convert Firestore timestamps to ISO strings
    createdAt: item.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: item.updatedAt?.toDate?.()?.toISOString() || null,
  };
}

/**
 * Sanitizes an array of related product items
 */
export function sanitizeRelatedProductItems(items: any[]) {
  return items.map(sanitizeRelatedProductItem);
}
