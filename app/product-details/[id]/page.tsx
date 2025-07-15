// app/product-details/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase/config";
import { AddToCartButton } from "../../components/add-to-cart-icon";
import type { Product } from "../../lib/types";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, StarHalf, ShoppingCart, Heart } from "lucide-react";

// Firestore document structure
interface FirestoreProduct {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  inStock: boolean;
  createdAt?: any;
  updatedAt?: any;
}

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailsPage = ({ params }: ProductDetailsPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productId, setProductId] = useState<string>("");
  const router = useRouter();

  // Resolve params Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setProductId(resolvedParams.id);
      } catch (err) {
        console.error("Error resolving params:", err);
        setError("Failed to load product parameters");
        setLoading(false);
      }
    };

    resolveParams();
  }, [params]);

  // Convert Firestore product to Product type
  const convertToProduct = (
    firestoreProduct: FirestoreProduct,
    docId: string
  ): Product => {
    return {
      id: firestoreProduct.id?.toString() || docId,
      name: firestoreProduct.name,
      description:
        firestoreProduct.description ||
        `${firestoreProduct.category} - ${firestoreProduct.subcategory}`,
      price: firestoreProduct.price,
      category: firestoreProduct.category,
      imageUrl: firestoreProduct.image,
      inventory: firestoreProduct.inStock ? 100 : 0,
      inStock: firestoreProduct.inStock,
      createdAt:
        firestoreProduct.createdAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
      rating: firestoreProduct.rating,
      reviewCount: Math.floor(Math.random() * 100) + 1,
    };
  };

  // Fetch product details from Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);

        // Try to get product by document ID first
        const docRef = doc(db, "clothing", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as FirestoreProduct;
          const productData = convertToProduct(data, docSnap.id);
          setProduct(productData);
        } else {
          // If not found by document ID, try to find by product ID field
          const productsRef = collection(db, "clothing");
          const q = query(productsRef, where("id", "==", parseInt(productId)));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data() as FirestoreProduct;
            const productData = convertToProduct(data, doc.id);
            setProduct(productData);
          } else {
            setError("Product not found");
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-5 h-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.inventory || 0)) {
      setQuantity(newQuantity);
    }
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <div className="space-x-4">
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                Product not found
              </p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.imageUrl || "/placeholder-image.jpg"}
              alt={product.name}
              className="w-full h-96 md:h-[500px] object-cover rounded-lg"
            />
            {!product.inStock && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Name and Category */}
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 capitalize">
                {product.category} •{" "}
                {product.category === "women" || product.category === "men"
                  ? product.description?.split(" - ")[1] || "Clothing"
                  : product.category}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="text-3xl font-bold text-green-600 mb-4">
                ${product.price}
              </div>
            </div>

            {/* Rating */}
            {/* <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.reviewCount} reviews)
              </span>
            </div> */}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={quantity >= (product.inventory || 0)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {product.inStock ? (
                <div className="flex-1">
                  <AddToCartButton product={product} />
                </div>
              ) : (
                <div className="flex-1">
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-6 rounded-md cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                </div>
              )}

              <button
                onClick={toggleWishlist}
                className={`p-3 rounded-md border transition-colors ${
                  isWishlisted
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Stock Status */}
            <div className="text-sm">
              {product.inStock ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ In Stock ({product.inventory} available)
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  ✗ Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
