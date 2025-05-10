import { TResumeFormValues } from "@/lib/validation";

export interface TResumeFormProps {
  resume: TResumeFormValues;
  setResumeData: (resume: TResumeFormValues) => void;
}
