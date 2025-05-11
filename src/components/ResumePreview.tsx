import { useEffect, useRef, useState } from "react";

import { TResumeFormValues } from "@/lib/validation";
import { cn } from "@/lib/utils";
import useDimensions from "@/hooks/use-dimensions";
import Image from "next/image";
import { formatDate } from "date-fns";

type ResumePreviewProps = {
  resume: TResumeFormValues;
  className?: string;
};

const ResumePreview = ({ resume, className }: ResumePreviewProps) => {
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(resumePreviewRef);

  return (
    <div
      ref={resumePreviewRef}
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <PersonalInfoHeader resume={resume} />
        <SummarySection resume={resume} />
        <WorkExperienceSection resume={resume} />
      </div>
    </div>
  );
};

export default ResumePreview;

type ResumeSectionProps = {
  resume: TResumeFormValues;
};

const PersonalInfoHeader = ({ resume }: ResumeSectionProps) => {
  const { photo, firstName, lastName, jobTitle, city, country, phone, email } =
    resume;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const photoUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (photoUrl) setPhotoSrc(photoUrl);

    if (photoUrl === null) setPhotoSrc("");

    return () => URL.revokeObjectURL(photoUrl);
  }, [photo]);

  return (
    <section className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          alt="Author photo"
          width={100}
          height={100}
          className="aspect-square object-cover"
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p className="text-3xl font-bold">
            {firstName} {lastName}
          </p>
          <p className="font-medium">{jobTitle}</p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </section>
  );
};

const SummarySection = ({ resume: { summary } }: ResumeSectionProps) => {
  if (!summary) return null;

  return (
    <section>
      <hr className="border-2" />
      <div className="break-inside-avoid space-y-3">
        <p className="mt-1 text-lg font-bold">Professional Summary</p>
        <div className="text-sm whitespace-pre-line">{summary}</div>
      </div>
    </section>
  );
};

const WorkExperienceSection = ({
  resume: { workExperience },
}: ResumeSectionProps) => {
  const workExperienceNotEmpty = workExperience?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperienceNotEmpty?.length) return null;

  return (
    <section>
      <hr className="border-2" />
      <div className="space-y-3">
        <p className="mt-1 text-lg font-bold">Work Experience</p>
      </div>
      {workExperienceNotEmpty.map((exp, index) => (
        <div key={index} className="break-inside-avoid space-y-1">
          <div className="item-center font-semi-bold flex justify-between text-sm">
            <span>{exp.position}</span>
            {exp.startDate && (
              <span>
                {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold">{exp.company}</p>
          <div className="text-xs whitespace-pre-line">
            <p>{exp.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};
