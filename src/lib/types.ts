import { TResumeFormValues } from "@/lib/validation";
import { Prisma } from "@/generated/prisma";

export interface TResumeFormProps {
  resume: TResumeFormValues;
  setResumeData: (resume: TResumeFormValues) => void;
}

export const resumeWithInclude = {
  workExperience: true,
  education: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeWithInclude;
}>;
