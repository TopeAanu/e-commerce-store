"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "../lib/cart-context";
import { useAuth } from "../lib/auth-context";
import { createOrder } from "../lib/firebase/orders";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  postalCode: z
    .string()
    .min(3, { message: "Postal code must be at least 3 characters" }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" }),
});

// Load Stripe with environment variable
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!stripe || !elements) {
      toast({
        title: "Payment system not ready",
        description: "Please wait for the payment system to load",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be signed in to complete checkout",
        variant: "destructive",
      });
      router.push("/signin?redirect=/checkout");
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      router.push("/products");
      return;
    }

    try {
      setIsLoading(true);

      // Create order in Firestore first
      const order = await createOrder({
        userId: user.uid,
        items: cart,
        shippingAddress: {
          name: values.name,
          address: values.address,
          city: values.city,
          postalCode: values.postalCode,
          country: values.country,
        },
        status: "pending",
        total: subtotal,
        createdAt: new Date(),
      });

      // Create payment intent via your API
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(subtotal * 100), // Convert to cents
          orderId: order.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: values.name,
              email: values.email,
              address: {
                line1: values.address,
                city: values.city,
                postal_code: values.postalCode,
                country: values.country,
              },
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // Payment successful
        clearCart();
        toast({
          title: "Payment successful!",
          description: "Your order has been placed successfully.",
        });
        router.push(`/orders/${order.id}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Shipping Information</h2>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Card Element Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment Information
                </h2>
                <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-black">
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                    Card Details
                  </label>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#ffffff", // White text for dark mode
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#9ca3af", // Light gray placeholder for dark mode
                          },
                        },
                        invalid: {
                          color: "#f87171", // Light red for errors in dark mode
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !stripe || !elements}
              >
                {isLoading ? "Processing..." : `Pay $${subtotal.toFixed(2)}`}
              </Button>
            </form>
          </Form>
        </div>

        <div className="bg-muted p-6 rounded-lg h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

          <div className="space-y-4 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Test Mode Notice */}
          {/* <div className="mt-4 p-3 bg-yellow-100 rounded-md text-sm">
            <p className="font-medium text-yellow-800">Test Mode</p>
            <p className="text-yellow-700">
              Use test card: 4242 4242 4242 4242
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
