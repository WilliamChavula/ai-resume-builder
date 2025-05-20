"use client";

import { createContext, ReactNode, useContext } from "react";
import { SubscriptionTier } from "@/lib/subscription";

const SubscriptionTierContext = createContext<SubscriptionTier | undefined>(
  undefined,
);

interface SubscriptionTierProviderProps {
  children: ReactNode;
  userSubscriptionTier: SubscriptionTier;
}

function SubscriptionTierProvider({
  userSubscriptionTier,
  children,
}: SubscriptionTierProviderProps) {
  return (
    <SubscriptionTierContext.Provider value={userSubscriptionTier}>
      {children}
    </SubscriptionTierContext.Provider>
  );
}

export default SubscriptionTierProvider;

export function useSubscriptionTier() {
  const context = useContext(SubscriptionTierContext);

  if (!context) {
    throw new Error(
      "useSubscriptionTier() must be used within SubscriptionTierProvider",
    );
  }

  return context;
}
