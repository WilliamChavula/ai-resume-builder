import { NextRequest } from "next/server";
import stripe from "@/lib/stripe";
import env from "@/env";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Invalid request", { status: 400 });
    }

    const stripeEvent = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    switch (stripeEvent.type) {
      case "checkout.session.completed":
        await handleStripeSessionCompleted(stripeEvent.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(stripeEvent.data.object.id);
        break;
      case "customer.subscription.deleted":
        await handleStripeSubscriptionDeleted(stripeEvent.data.object);
        break;
      default:
        console.log(`Unsupported event type received: ${stripeEvent.type}`);
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (e) {
    console.error("Internal Server Error", e);

    return new Response("Internal Server Error", { status: 500 });
  }
}

async function handleStripeSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("Missing user id in Stripe.Checkout.Session");
  }

  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  });
}
async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  if (subscription.status === "active" || subscription.status === "trialing") {
    await prisma.userSubscription.upsert({
      where: { userId: subscription.metadata.userId },
      create: {
        userId: subscription.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.items.data[0].current_period_end * 1000,
        ),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      update: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.items.data[0].current_period_end * 1000,
        ),
        stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } else {
    await prisma.userSubscription.delete({
      where: { stripeCustomerId: subscription.customer as string },
    });
  }
}

async function handleStripeSubscriptionDeleted(
  subscription: Stripe.Subscription,
) {
  await prisma.userSubscription.delete({
    where: { stripeCustomerId: subscription.customer as string },
  });
}
