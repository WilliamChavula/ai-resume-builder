import { Metadata } from "next";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import GetSubscriptionButton from "@/app/(main)/billing/components/GetSubscriptionButton";
import { formatDate } from "date-fns";
import ManageSubscriptionButton from "@/app/(main)/billing/components/ManageSubscriptionButton";

export const metadata: Metadata = {
  title: "Billing",
};

async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: { userId: userId },
  });

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl">Billing</h1>
      <p>
        Your current plan:
        <span className="font-bold">
          {priceInfo ? (priceInfo.product as Stripe.Product).name : "Free"}
        </span>
      </p>
      {subscription ? (
        <>
          {subscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              Your subscription will end on{" "}
              {formatDate(subscription.stripeCurrentPeriodEnd, "MMMM dd, yyyy")}
            </p>
          )}
          <ManageSubscriptionButton />
        </>
      ) : (
        <>
          <GetSubscriptionButton />
        </>
      )}
    </main>
  );
}

export default Page;
