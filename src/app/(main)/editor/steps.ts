import { ComponentType } from "react";
import GeneralInfoForm from "@/app/(main)/editor/forms/GeneralInfoForm";
import PersonalInfoForm from "@/app/(main)/editor/forms/PersonalInfoForm";
import { TResumeFormProps } from "@/lib/types";

export const steps: {
  title: string;
  component: ComponentType<TResumeFormProps>;
  key: string;
}[] = [
  {
    title: "General Info",
    component: GeneralInfoForm,
    key: "general-info",
  },
  {
    title: "Personal Info",
    component: PersonalInfoForm,
    key: "personal-info",
  },
];
