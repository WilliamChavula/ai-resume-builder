import { TResumeFormValues } from "@/lib/validation";
import ResumePreview from "@/components/ResumePreview";
import ColorPicker from "@/components/ColorPicker";

type ResumePreviewSectionProps = {
  resume: TResumeFormValues;
  setResumeValues: (resume: TResumeFormValues) => void;
};

const ResumePreviewSection = ({
  resume,
  setResumeValues,
}: ResumePreviewSectionProps) => {
  return (
    <div className="relative hidden md:flex md:w-1/2">
      <div className="absolute top-1 left-1 flex flex-none flex-col gap-3 lg:top-3 lg:left-3">
        <ColorPicker
          color={resume.colorHex}
          onColorChange={(color) =>
            setResumeValues({ ...resume, colorHex: color.hex })
          }
        />
      </div>
      <div className="bg-secondary flex w-full justify-center overflow-y-auto p-3">
        <ResumePreview resume={resume} className="max-w-2xl shadow-md" />
      </div>
    </div>
  );
};

export default ResumePreviewSection;
