import { Category, Product } from "@/sanity.types";
import React from "react";

interface ProductsViewProps {
  products: Product[];
  categories: Category[];
}

function ProductsView({ products, categories }: ProductsViewProps) {
  return <div>ProductsView</div>;
}

export default ProductsView;
