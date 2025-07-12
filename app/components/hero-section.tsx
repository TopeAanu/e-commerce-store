import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-screen h-[70vh] min-h-[500px] -mx-[50vw] left-1/2 right-1/2">
      <div className="max-w-[1000px] mx-auto h-full px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center h-full py-8">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 -mt-4 sm:-mt-6">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-tight">
                Welcome to MelStore
              </h1>
              <p className="max-w-[600px] mx-auto lg:mx-0 text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Discover our curated collection of products with free shipping
                on all orders.
              </p>
            </div>
            {/* <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Shop Now
                </Link>
              </Button>
            </div> */}
          </div>

          {/* Right side - Image */}
          <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2 pb-0 -mb-4">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <img
                src="https://i.ibb.co/hFbmrt3k/shopping-1-removebg-preview.png"
                alt="Shopping experience"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
