import { Button } from "@/components/ui/button";
import Link from "next/link";
import { steps } from "@/app/(main)/editor/steps";
import { FileUser, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

type FooterProps = {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showResumeMobile: boolean;
  setShowResumeMobile: (show: boolean) => void;
  isSaving: boolean;
};

const Footer = ({
  currentStep,
  setCurrentStep,
  showResumeMobile,
  setShowResumeMobile,
  isSaving,
}: FooterProps) => {
  const prevStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={prevStep ? () => setCurrentStep(prevStep) : undefined}
            disabled={!prevStep}
          >
            Previous step
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Next step
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowResumeMobile(!showResumeMobile)}
          className="md:hidden"
          title={showResumeMobile ? "Show input form" : "Show resume preview"}
        >
          {showResumeMobile ? <PenLine /> : <FileUser />}
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" asChild>
            <Link href="/resumes">Close</Link>
          </Button>
          <p
            className={cn(
              "text-muted-foreground opacity-0",
              isSaving && "opacity-100",
            )}
          >
            Saving...
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
