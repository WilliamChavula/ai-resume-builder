import { useState } from "react";

import { WandSparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSummary } from "@/app/(main)/editor/forms/actions/actions";
import { TResumeFormValues } from "@/lib/validation";

import LoadingButton from "@/components/LoadingButton";
import { useSubscriptionTier } from "@/app/(main)/_providers/SubscriptionTierProvider";
import usePremiumModal from "@/hooks/use-premium-modal";
import { canUseAITools } from "@/lib/permissions";

interface GenerateSummaryButtonProps {
  resume: TResumeFormValues;
  onSummaryGenerated: (summary: string) => void;
}

const GenerateSummaryButton = (props: GenerateSummaryButtonProps) => {
  const { onSummaryGenerated, resume } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const subscriptionTier = useSubscriptionTier();
  const { setOpen } = usePremiumModal();

  const handleClick = async () => {
    try {
      if (!canUseAITools(subscriptionTier)) {
        setOpen(true);
        return;
      }
      setIsLoading(true);
      const aiResponse = await generateSummary(resume);
      onSummaryGenerated(aiResponse);
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={isLoading}
      type="button"
      onClick={handleClick}
      variant="outline"
    >
      <WandSparkles className="size-4" /> Generate (AI)
    </LoadingButton>
  );
};

export default GenerateSummaryButton;
