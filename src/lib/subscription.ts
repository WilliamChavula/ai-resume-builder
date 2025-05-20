import { cache } from "react";
import prisma from "@/lib/prisma";

import env from "@/env";

export type SubscriptionTier = "free" | "pro" | "pro_plus";

export const getUserSubscriptionTier = cache(
  async (userId: string): Promise<SubscriptionTier> => {
    const userSubscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (
      !userSubscription ||
      userSubscription.stripeCurrentPeriodEnd < new Date()
    ) {
      return "free";
    }

    if (
      userSubscription.stripePriceId ===
      env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY
    ) {
      return "pro";
    }

    if (
      userSubscription.stripePriceId ===
      env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
    ) {
      return "pro_plus";
    }

    throw new Error("Invalid subscription");
  },
);
