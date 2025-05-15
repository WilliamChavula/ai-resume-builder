"use client";

import { useSearchParams } from "next/navigation";

import { steps } from "@/app/(main)/editor/steps";
import BreadCrumbs from "@/app/(main)/editor/BreadCrumbs";
import Footer from "@/app/(main)/editor/Footer";
import { useState } from "react";
import { TResumeFormValues } from "@/lib/validation";
import ResumePreviewSection from "@/app/(main)/editor/ResumePreviewSection";
import { cn } from "@/lib/utils";
import { useAutoSave } from "@/hooks/use-auto-save";
import useUnloadWarning from "@/hooks/use-unload-warning";

const ResumeEditor = () => {
  const [resumeData, setResumeData] = useState<TResumeFormValues>({});
  const [showResumeMobile, setShowResumeMobile] = useState(false);
  const { isSaving, hasUnsavedChanges } = useAutoSave(resumeData);
  useUnloadWarning(hasUnsavedChanges);

  const params = useSearchParams();
  const currentStep = params.get("step") || steps[0].key;

  const setStep = (key: string) => {
    const newSearchParams = new URLSearchParams(params);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-muted-foreground text-sm">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute top-0 bottom-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showResumeMobile && "hidden",
            )}
          >
            <BreadCrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resume={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            resume={resumeData}
            setResumeValues={setResumeData}
            className={cn(showResumeMobile && "flex")}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showResumeMobile={showResumeMobile}
        setShowResumeMobile={setShowResumeMobile}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ResumeEditor;
