import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={`${inter.className} overflow-x-hidden`}> */}
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
                <main className="flex-1">{children}</main>
              </div>
              <Footer />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
