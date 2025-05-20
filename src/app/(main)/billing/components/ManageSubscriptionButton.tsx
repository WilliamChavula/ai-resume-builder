"use client";

import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { createCustomerBillingPortalSession } from "@/app/(main)/billing/actions";

function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      setLoading(true);
      window.location.href = await createCustomerBillingPortalSession();
    } catch (e) {
      console.error("Something went wrong in ManageSubscriptionButton: ", e);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <LoadingButton loading={loading} onClick={handleClick}>
      Manage Subscription
    </LoadingButton>
  );
}

export default ManageSubscriptionButton;
