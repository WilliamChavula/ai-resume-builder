import { SubscriptionTier } from "@/lib/subscription";

export const canCreateResume = (
  subscriptionTier: SubscriptionTier,
  resumeCount: number,
): boolean => {
  const resumeMap: Record<SubscriptionTier, number> = {
    free: 1,
    pro: 3,
    pro_plus: Infinity,
  };

  const maxResume = resumeMap[subscriptionTier];

  return resumeCount < maxResume;
};

export const canUseAITools = (subscriptionTier: SubscriptionTier) => {
  return subscriptionTier !== "free";
};

export const canUseCustomizations = (subscriptionTier: SubscriptionTier) => {
  return subscriptionTier === "pro_plus";
};
