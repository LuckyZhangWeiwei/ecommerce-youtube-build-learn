import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByCategory } from "@/sanity/lib/products/getProductsByCategory";
import React from "react";

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const products = await getProductsByCategory(slug);

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            No products found for "{slug}"
          </h1>
          <p className="text-gray-600 text-center">
            Please try a different search term.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-100 p-4">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Search results for {slug}
        </h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default page;
