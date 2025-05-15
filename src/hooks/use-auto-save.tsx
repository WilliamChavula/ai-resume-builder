import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { saveResume } from "@/app/(main)/editor/actions/action";
import { useDebounce } from "@/lib/debounce";
import { replacer } from "@/lib/utils";
import { TResumeFormValues } from "@/lib/validation";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export const useAutoSave = (resume: TResumeFormValues) => {
  const [lastSavedData, setLastSavedData] = useState<TResumeFormValues>(
    structuredClone(resume),
  );
  const [resumeId, setResumeId] = useState<string | undefined>(resume.id);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();

  const debouncedResumeValues = useDebounce<TResumeFormValues>(resume, 1500);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeValues]);

  useEffect(() => {
    const save = async () => {
      try {
        setIsSaving(true);
        setIsError(false);

        const data = structuredClone(debouncedResumeValues);
        const response = await saveResume({
          ...data,
          ...(JSON.stringify(lastSavedData.photo, replacer) ===
            JSON.stringify(data.photo, replacer) && {
            photo: undefined,
          }),
          id: resumeId,
        });

        setResumeId(response.id);
        setLastSavedData(data);

        if (searchParams.get("resumeId") !== response.id) {
          const params = new URLSearchParams(searchParams);
          params.set("resumeId", response.id);

          window.history.replaceState(null, "", `?${params.toString()}`);
        }
      } catch (e) {
        setIsError(true);
        console.error("Error", e);

        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }
    };

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeValues, replacer) !==
      JSON.stringify(lastSavedData, replacer);

    if (hasUnsavedChanges && debouncedResumeValues && !isSaving && !isError) {
      save();
    }
  }, [
    debouncedResumeValues,
    isError,
    isSaving,
    lastSavedData,
    resumeId,
    searchParams,
  ]);

  return {
    isSaving,
    hasUnsavedChanges: JSON.stringify(resume) !== JSON.stringify(lastSavedData),
  };
};
