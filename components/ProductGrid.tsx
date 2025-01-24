"use cilent";

import { Product } from "@/sanity.types";
import * as motion from "motion/react-client";
import ProductThumb from "./ProductThumb";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        return (
          <motion.div
            key={product._id}
            layout
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <ProductThumb product={product} />
          </motion.div>
        );
      })}
    </div>
  );
}
