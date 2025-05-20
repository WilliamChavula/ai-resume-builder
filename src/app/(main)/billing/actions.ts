"use server";

import { currentUser } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import env from "@/env";

export async function createCustomerBillingPortalSession() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as
    | string
    | undefined;

  if (!stripeCustomerId) {
    throw new Error("Something went wrong, StripeCustomerId is missing.");
  }

  const billingSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
  });

  if (!billingSession.url) {
    throw new Error("failed to create Billing Management portal.");
  }

  return billingSession.url;
}
