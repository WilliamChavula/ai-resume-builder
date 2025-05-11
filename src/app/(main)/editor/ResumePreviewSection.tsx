import { TResumeFormValues } from "@/lib/validation";
import ResumePreview from "@/components/ResumePreview";

type ResumePreviewSectionProps = {
  resume: TResumeFormValues;
  setResumeValues: (resume: TResumeFormValues) => void;
};

const ResumePreviewSection = ({
  resume,
  setResumeValues,
}: ResumePreviewSectionProps) => {
  return (
    <div className="hidden md:flex md:w-1/2">
      <div className="bg-secondary flex w-full justify-center overflow-y-auto p-3">
        <ResumePreview resume={resume} className="max-w-2xl shadow-md" />
      </div>
    </div>
  );
};

export default ResumePreviewSection;
