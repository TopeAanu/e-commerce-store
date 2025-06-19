// import { Suspense } from "react";
// import { getProducts } from "../../app/lib/firebase/products";
// import ProductGrid from "../../app/components/product-grid";
// import ProductFilters from "../../app/components/product-filters";

// interface SearchParams {
//   category?: string;
//   sort?: string;
//   minPrice?: string;
//   maxPrice?: string;
// }

// export default async function ProductsPage({
//   searchParams,
// }: {
//   searchParams: Promise<SearchParams>;
// }) {
//   // Await the searchParams Promise
//   const resolvedSearchParams = await searchParams;

//   return (
//     <div className="container px-4 py-8 md:py-12">
//       <h1 className="text-3xl font-bold mb-8">All Products</h1>
//       <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
//         <ProductFilters />
//         <div>
//           <Suspense
//             fallback={<p className="text-center py-12">Loading products...</p>}
//           >
//             <ProductsList searchParams={resolvedSearchParams} />
//           </Suspense>
//         </div>
//       </div>
//     </div>
//   );
// }

// async function ProductsList({ searchParams }: { searchParams: SearchParams }) {
//   const products = await getProducts(searchParams);

//   if (products.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p>No products found. Try adjusting your filters.</p>
//       </div>
//     );
//   }

//   return <ProductGrid products={products} />;
// }
