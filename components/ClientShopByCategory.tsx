// // components/ClientShopByCategory.tsx
// "use client";

// import React from "react";
// import { useCategories } from "../hooks/useCategories";
// import ShopByCategory from "../components/ShopByCategory";

// interface ClientShopByCategoryProps {
//   title?: string;
//   className?: string;
//   featured?: boolean;
//   limit?: number;
// }

// const ClientShopByCategory: React.FC<ClientShopByCategoryProps> = ({
//   title = "Shop by Category",
//   className = "",
//   featured = false,
//   limit,
// }) => {
//   const { categories, loading, error, refetch } = useCategories(
//     featured,
//     limit
//   );

//   if (loading) {
//     return (
//       <section className={`py-12 bg-gray-50 ${className}`}>
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
//             <div className="h-4 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {[...Array(limit || 8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-lg shadow-md overflow-hidden"
//               >
//                 <div className="h-48 bg-gray-300 animate-pulse"></div>
//                 <div className="p-4">
//                   <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
//                   <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
//                   <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className={`py-12 bg-gray-50 ${className}`}>
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
//           <div className="text-red-600 mb-4">
//             <p>Sorry, we couldn't load categories at the moment.</p>
//             <p className="text-sm text-gray-500 mb-4">{error}</p>
//             <button
//               onClick={refetch}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <ShopByCategory
//       categories={categories}
//       title={title}
//       className={className}
//     />
//   );
// };

// export default ClientShopByCategory;
