"use client";

import React, { useEffect, useState } from "react";
import { useBasketStore } from "../store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AddtoBasketButton from "@/components/AddtoBasketButton";
import { urlFor } from "@/sanity/lib/image";
import Loader from "@/components/Loader";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";

function Basket() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // wait client to mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = async () => {
    if (!isSignedIn) return;

    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Unknown",
        customerEmail: user?.emailAddresses[0].emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      };

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating checkout session", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return <Loader />;
  }

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col item-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Basket</h1>
        <p className="text-gray-600 text-lg">Your basket is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Your Basket</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {groupedItems.map((item) => (
            <div
              key={item.product._id}
              className="mb-4 p-4 border rounded flex items-center justify-between"
            >
              <div className="flex min-w-0 flex-1 cursor-pointer items-center">
                <div
                  className="mr-4 h-20 w-20 flex-hrink-0 sm:h-24 sm:w-24"
                  onClick={() =>
                    router.push(`/product/${item.product.slug?.current}`)
                  }
                >
                  {item.product.image && (
                    <Image
                      src={urlFor(item.product.image).url() || ""}
                      alt={item.product.name ?? "Product image"}
                      width={96}
                      height={96}
                      className="h-full w-full rounded object-cover"
                    />
                  )}
                </div>
                <div
                  className="min-w-0"
                  onClick={() =>
                    router.push(`/product/${item.product.slug?.current}`)
                  }
                >
                  <h2 className="truncate text-lg font-semibold sm:text-xl">
                    {item.product.name}
                  </h2>
                  <p className="text-sm sm:text-base">
                    Price: $
                    {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center ml-4 flex-shrink-0">
                <AddtoBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 order-first h-fit w-full rounded border bg-white p-6 lg:sticky lg:left-auto lg:top-4 lg:order-last lg:w-80">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items: </span>
              <span>
                {groupedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between border-t pt-2 text-2xl font-bold">
              <span>Total:</span>
              <span>
                ${useBasketStore.getState().getTotalPrice().toFixed(2)}
              </span>
            </p>
          </div>
          {isSignedIn ? (
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-4 w-full rounded bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Sign in to Checkout
              </button>
            </SignInButton>
          )}
        </div>
        <div className="h-64 lg:h-0"></div>
      </div>
    </div>
  );
}

export default Basket;
