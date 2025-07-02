"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById } from "../../lib/firebase/orders";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../../../components/ui/button";
import { useToast } from "../../../components/ui/use-toast";
import type { Order } from "../../lib/types";

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your order",
          variant: "destructive",
        });
        router.push("/signin");
        return;
      }

      if (!orderId) {
        setError("Order ID not found");
        setLoading(false);
        return;
      }

      try {
        const fetchedOrder = await getOrderById(orderId);

        if (!fetchedOrder) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        // Check if the order belongs to the current user
        if (fetchedOrder.userId !== user.uid) {
          setError("You don't have permission to view this order");
          setLoading(false);
          return;
        }

        setOrder(fetchedOrder);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, router, toast]);

  if (loading) {
    return (
      <div className="container px-4 py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="dark:text-white">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container px-4 py-8 md:py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Order Not Found
          </h1>
          <p className="text-muted-foreground mb-6 dark:text-gray-400">
            {error || "The order you're looking for doesn't exist."}
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push("/profile")} variant="outline">
              View All Orders
            </Button>
            <Button onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "processing":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      case "shipped":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
      case "delivered":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800";
    }
  };

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold dark:text-white">
              Order Details
            </h1>
            <Button variant="outline" onClick={() => router.push("/profile")}>
              ← Back to Orders
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground dark:text-gray-400">
            <span>Order ID: {order.id}</span>
            <span>•</span>
            <span>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Order Placed Successfully!
              </h2>
              <p className="text-green-600 dark:text-green-300">
                Thank you for your purchase. We'll send you updates as your
                order progresses.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-black border dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-4 border-b dark:border-gray-700 last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Status */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white dark:bg-black border dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">
                Order Status
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-black border dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="dark:text-gray-300">Subtotal</span>
                  <span className="dark:text-white">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-300">Shipping</span>
                  <span className="dark:text-white">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-300">Tax</span>
                  <span className="dark:text-white">$0.00</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="dark:text-white">Total</span>
                    <span className="dark:text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-black border dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">
                Shipping Address
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-medium dark:text-white">
                  {order.shippingAddress.name}
                </p>
                <p className="dark:text-gray-300">
                  {order.shippingAddress.address}
                </p>
                <p className="dark:text-gray-300">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="dark:text-gray-300">
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
          <Button variant="outline" onClick={() => window.print()}>
            Print Order
          </Button>
        </div>
      </div>
    </div>
  );
}
