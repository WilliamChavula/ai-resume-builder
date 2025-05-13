import { TResumeFormValues } from "@/lib/validation";
import ResumePreview from "@/components/ResumePreview";
import ColorPicker from "@/app/(main)/editor/ColorPicker";
import BorderStyleButton from "@/app/(main)/editor/BorderStyleButton";
import { cn } from "@/lib/utils";

type ResumePreviewSectionProps = {
  resume: TResumeFormValues;
  setResumeValues: (resume: TResumeFormValues) => void;
  className?: string;
};

const ResumePreviewSection = ({
  resume,
  setResumeValues,
  className,
}: ResumePreviewSectionProps) => {
  return (
    <div
      className={cn("group relative hidden w-full md:flex md:w-1/2", className)}
    >
      <div className="absolute top-1 left-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:top-3 lg:left-3 xl:opacity-100">
        <ColorPicker
          color={resume.colorHex}
          onColorChange={(color) =>
            setResumeValues({ ...resume, colorHex: color.hex })
          }
        />
        <BorderStyleButton
          borderStyle={resume.borderStyle}
          onBorderStyleChanged={(borderStyle) =>
            setResumeValues({ ...resume, borderStyle })
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
