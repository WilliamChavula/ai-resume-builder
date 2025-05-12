import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { formatDate } from "date-fns";

import useDimensions from "@/hooks/use-dimensions";
import { cn } from "@/lib/utils";
import { TResumeFormValues } from "@/lib/validation";
import { Badge } from "@/components/ui/badge";
import { BORDER_STYLES } from "@/app/(main)/editor/BorderStyleButton";

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
        <EducationSection resume={resume} />
        <SkillsSection resume={resume} />
      </div>
    </div>
  );
};

export default ResumePreview;

type ResumeSectionProps = {
  resume: TResumeFormValues;
};

const PersonalInfoHeader = ({ resume }: ResumeSectionProps) => {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resume;

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
          style={{
            borderRadius:
              borderStyle === BORDER_STYLES.SQUARE
                ? "0px"
                : borderStyle === BORDER_STYLES.CIRCLE
                  ? "9999px"
                  : "10%",
          }}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p
            className="text-3xl font-bold"
            style={{
              color: colorHex,
            }}
          >
            {firstName} {lastName}
          </p>
          <p
            className="font-medium"
            style={{
              color: colorHex,
            }}
          >
            {jobTitle}
          </p>
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

const SummarySection = ({
  resume: { summary, colorHex },
}: ResumeSectionProps) => {
  if (!summary) return null;

  return (
    <section>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="mt-1 text-lg font-bold"
          style={{
            color: colorHex,
          }}
        >
          Professional Summary
        </p>
        <div className="text-sm whitespace-pre-line">{summary}</div>
      </div>
    </section>
  );
};

const WorkExperienceSection = ({
  resume: { workExperience, colorHex },
}: ResumeSectionProps) => {
  const workExperienceNotEmpty = workExperience?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperienceNotEmpty?.length) return null;

  return (
    <section>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="mt-1 text-lg font-bold"
          style={{
            color: colorHex,
          }}
        >
          Work Experience
        </p>
      </div>
      {workExperienceNotEmpty.map((exp, index) => (
        <div key={index} className="break-inside-avoid space-y-1">
          <div
            className="item-center font-semi-bold flex justify-between text-sm"
            style={{
              color: colorHex,
            }}
          >
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

const EducationSection = ({
  resume: { education, colorHex },
}: ResumeSectionProps) => {
  const educationNotEmpty = education?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationNotEmpty?.length) return null;

  return (
    <section>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="space-y-3">
        <p
          className="mt-1 text-lg font-bold"
          style={{
            color: colorHex,
          }}
        >
          Education
        </p>
      </div>
      {educationNotEmpty.map((edu, index) => (
        <div key={index} className="break-inside-avoid space-y-1">
          <div
            className="item-center font-semi-bold flex justify-between text-sm"
            style={{
              color: colorHex,
            }}
          >
            <span>{edu.degree}</span>
            {edu.startDate && (
              <span>
                {`${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold">{edu.school}</p>
        </div>
      ))}
    </section>
  );
};

const SkillsSection = ({
  resume: { skills, colorHex, borderStyle },
}: ResumeSectionProps) => {
  if (!skills?.length) return null;

  return (
    <section>
      <hr
        className="border-2"
        style={{
          borderColor: colorHex,
        }}
      />
      <div className="break-inside-avoid space-y-3">
        <p
          className="mt-1 text-lg font-bold"
          style={{
            color: colorHex,
          }}
        >
          Skills
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills?.map((skill, index) => (
            <Badge
              key={index}
              className="rounded-md bg-black text-white hover:bg-black"
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BORDER_STYLES.SQUARE
                    ? "0px"
                    : borderStyle === BORDER_STYLES.CIRCLE
                      ? "9999px"
                      : "8px",
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};
