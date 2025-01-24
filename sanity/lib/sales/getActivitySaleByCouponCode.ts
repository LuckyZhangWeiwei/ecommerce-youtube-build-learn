import { defineQuery } from "next-sanity";
import { CouponCode } from "./CouponCodes";
import { sanityFetch } from "../live";

export const getActivitySaleByCouponCode = async (couponCode: CouponCode) => {
  const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
        *[
            _type == "sales" 
            && couponCode == $couponCode 
            && isActive == true
            ] | order(validFrom desc) [0]
    `);

  try {
    const activeSale = await sanityFetch({
      query: ACTIVE_SALE_BY_COUPON_QUERY,
      params: { couponCode },
    });

    return activeSale ? activeSale.data : null;
  } catch (error) {
    console.error("Error fetching active sale by coupon code:", error);
    return null;
  }
};