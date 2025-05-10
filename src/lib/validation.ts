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

export const resumeFormSchema = z.object({
  ...generalInfoFormSchema.shape,
  ...personalInfoFormSchema.shape,
});

export type TGeneralInfoForm = z.infer<typeof generalInfoFormSchema>;
export type TPersonalInfoForm = z.infer<typeof personalInfoFormSchema>;
export type TResumeFormValues = Omit<
  z.infer<typeof resumeFormSchema>,
  "photo"
> & {
  id?: string;
  photo?: File | string | null;
};
