import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "../app/components/navbar";
import { Toaster } from "../components/ui/toaster";
import { CartProvider } from "../app/lib/cart-context";
import { AuthProvider } from "../app/lib/auth-context";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MelSore - Ecommerce Store",
  description:
    "Discover the best deals on electronics, fashion, home goods, and more at MelSore. Shop now for quality products at unbeatable prices.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

// Progressive loading skeleton
function ProgressiveLoader() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"
          ></div>
        ))}
      </div>
    </div>
  );
}

// Error boundary for lazy loading
function LazyErrorBoundary({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ProgressiveLoader />}>{children}</Suspense>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${inter.className} overflow-x-hidden`}
        style={{ maxWidth: "100vw", overflowX: "hidden" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="nextshop-theme"
        >
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <div className="min-h-screen flex flex-col max-w-[1000px] mx-auto">
                <main className="flex-1">
                  <LazyErrorBoundary>{children}</LazyErrorBoundary>
                </main>
              </div>
              {/* Footer can also be lazy loaded if it's heavy */}
              <Suspense
                fallback={
                  <div className="h-32 bg-gray-100 dark:bg-gray-800"></div>
                }
              >
                <Footer />
              </Suspense>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
