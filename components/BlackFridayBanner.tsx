import { COUPON_CODES } from "@/sanity/lib/sales/CouponCodes";
import { getActivitySaleByCouponCode } from "@/sanity/lib/sales/getActivitySaleByCouponCode";

async function BlackFridayBanner() {
  const sales = await getActivitySaleByCouponCode(COUPON_CODES.BFRIDAY);
  if (!sales) return null;
  return (
    <div className="bg-gradient-to-r from-red-600 to-black text-white px-6 py-10 mx-4 mt-2 rounded-lg shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="mb-4 text-left text-3xl font-extrabold sm:text-5xl">
            {sales.title}
          </h2>
          <p className="mb-6 text-left text-xl font-semibold sm:text-3xl">
            {sales.description}
          </p>
          <div className="flex">
            <div className="transform rounded-full bg-white px-6 py-4 text-black shadow-md transition duration-300 hover:scale-105">
              <span className="text-base font-bold sm:text-xl">
                Use code:
                <span className="text-red-600">{sales.couponCode}</span>
              </span>
              <span className="ml-2 text-base font-bold sm:text-xl">
                for {sales.discountAmount}% off!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlackFridayBanner;
