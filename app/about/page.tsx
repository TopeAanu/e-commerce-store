export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">About NextShop</h1>

        <div className="prose max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Welcome to NextShop, your premier destination for quality products at affordable prices.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-6">
            We're committed to providing our customers with the best shopping experience possible. From electronics to
            home goods, beauty products to clothing, we curate only the finest items for our collection.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Why Choose NextShop?</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Carefully curated product selection</li>
            <li>Competitive prices and regular sales</li>
            <li>Fast and reliable shipping</li>
            <li>Excellent customer service</li>
            <li>Secure and easy checkout process</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            Have questions or need assistance? We're here to help! Reach out to our customer service team and we'll get
            back to you as soon as possible.
          </p>
        </div>
      </div>
    </div>
  )
}
