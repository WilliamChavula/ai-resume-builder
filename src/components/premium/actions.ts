"use server";

import { currentUser } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import env from "@/env";

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as
    | string
    | undefined;

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId
      ? undefined
      : user.emailAddresses[0].emailAddress,
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read and agree to AI Builder's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) policy.`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}
