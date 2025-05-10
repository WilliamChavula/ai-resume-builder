import { ComponentType } from "react";
import GeneralInfoForm from "@/app/(main)/editor/forms/GeneralInfoForm";
import PersonalInfoForm from "@/app/(main)/editor/forms/PersonalInfoForm";
import WorkExperienceForm from "@/app/(main)/editor/forms/WorkExperienceForm";
import { TResumeFormProps } from "@/lib/types";
import EducationForm from "@/app/(main)/editor/forms/EducationForm";
import SkillsForm from "@/app/(main)/editor/forms/SkillsForm";

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
  {
    title: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Education",
    component: EducationForm,
    key: "education",
  },
  {
    title: "Skills",
    component: SkillsForm,
    key: "skill",
  },
];
