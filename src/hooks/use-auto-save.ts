import { TResumeFormValues } from "@/lib/validation";
import { useDebounce } from "@/lib/debounce";
import { useEffect, useState } from "react";

export const useAutoSave = (resume: TResumeFormValues) => {
  const [lastSavedData, setLastSavedData] = useState<TResumeFormValues>(
    structuredClone(resume),
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const debouncedResumeValues = useDebounce<TResumeFormValues>(resume, 1500);

  useEffect(() => {
    const save = async () => {
      setIsSaving(true);

      // Todo: Call API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setLastSavedData(structuredClone(debouncedResumeValues));
      setIsSaving(false);
    };

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeValues) !== JSON.stringify(lastSavedData);

    if (hasUnsavedChanges && debouncedResumeValues && !isSaving) {
      save();
    }
  }, [debouncedResumeValues, isSaving, lastSavedData]);

  return {
    isSaving,
    hasUnsavedChanges: JSON.stringify(resume) !== JSON.stringify(lastSavedData),
  };
};
