import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllProducts = async () => {
  const allproductsquery = defineQuery(
    `*[_type == "product"] | order(name asc)`
  );

  try {
    const products = await sanityFetch({
      query: allproductsquery,
    });
    return products.data || [];
  } catch (error) {
    console.error("error fetching all products:", error);
    return [];
  }
};
