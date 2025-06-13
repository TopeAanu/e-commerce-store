import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://i.ibb.co/W4Sg75Zv/shopping-1.jpg')",
      }}
    >
      {/* Background overlay for opacity */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
              Welcome to MelStore
            </h1>
            <p className="mx-auto max-w-[700px] text-white/70 md:text-xl">
              Discover our curated collection of products with free shipping on
              all orders.
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
  );
}
