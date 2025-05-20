"use client";

import usePremiumModal from "@/hooks/use-premium-modal";
import { Button } from "@/components/ui/button";

function GetSubscriptionButton() {
  const { setOpen } = usePremiumModal();
  return (
    <Button variant="premium" onClick={() => setOpen(true)}>
      Start Premium Subscription
    </Button>
  );
}

export default GetSubscriptionButton;
