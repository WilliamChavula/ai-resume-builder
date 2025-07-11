import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoFormSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export const personalInfoFormSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      {
        message: "Invalid file type. Must be an image",
        path: ["photo"],
      },
    )
    .refine((file) => !file || file.size <= 4 * 1024 * 1024, {
      message: "Image should be at most 4MB",
      path: ["photo"],
    }),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: z.string().optional(),
});

export const workExperienceSchema = z.object({
  workExperience: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      }),
    )
    .optional(),
});

export const educationSchema = z.object({
  education: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export const summarySchema = z.object({
  summary: optionalString,
});

export const resumeFormSchema = z.object({
  ...generalInfoFormSchema.shape,
  ...personalInfoFormSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
});

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
});

export const generateWorkExperienceSchema = z.object({
  description: z
    .string({
      message:
        "Please describe your job experience for AI to fill your work experience fields",
    })
    .min(20, {
      message: "You description should at least be 20 characters long",
    }),
});

export type TGeneralInfoForm = z.infer<typeof generalInfoFormSchema>;
export type TPersonalInfoForm = z.infer<typeof personalInfoFormSchema>;
export type TWorkExperienceForm = z.infer<typeof workExperienceSchema>;
export type TWorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperience"]
>[number];
export type TEducationForm = z.infer<typeof educationSchema>;
export type TSkills = z.infer<typeof skillsSchema>;
export type TSummary = z.infer<typeof summarySchema>;
export type TGenerateSummary = z.infer<typeof generateSummarySchema>;
export type TGenerateWorkExperience = z.infer<
  typeof generateWorkExperienceSchema
>;
export type TResumeFormValues = Omit<
  z.infer<typeof resumeFormSchema>,
  "photo"
> & {
  id?: string;
  photo?: File | string | null;
};
