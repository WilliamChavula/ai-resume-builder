import React from "react";
import Navbar from "./Navbar";
import { auth } from "@clerk/nextjs/server";

import { getUserSubscriptionTier } from "@/lib/subscription";

import PremiumModal from "@/components/premium/PremiumModal";
import SubscriptionTierProvider from "@/app/(main)/_providers/SubscriptionTierProvider";

async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscriptionTier = await getUserSubscriptionTier(userId);

  return (
    <SubscriptionTierProvider userSubscriptionTier={subscriptionTier}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
        <PremiumModal />
      </div>
    </SubscriptionTierProvider>
  );
}

export default Layout;
