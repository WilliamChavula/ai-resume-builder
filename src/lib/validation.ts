import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoFormSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type TGeneralInfoForm = z.infer<typeof generalInfoFormSchema>;
