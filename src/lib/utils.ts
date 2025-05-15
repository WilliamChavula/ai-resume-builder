import crypto from "crypto";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "@/lib/types";
import { TResumeFormValues } from "@/lib/validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateName() {
  const bytes = crypto.randomBytes(24);
  return bytes.toString("base64url");
}

export function replacer(_key: unknown, fileLike: unknown) {
  if (fileLike instanceof File) {
    return {
      name: fileLike.name,
      size: fileLike.size,
      type: fileLike.type,
      lastModified: fileLike.lastModified,
    };
  }

  return fileLike;
}

export function toResumeFormValuesMapper(
  data: ResumeServerData,
): TResumeFormValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    summary: data.summary || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    email: data.email || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    workExperience: data.workExperience.map((exp) => ({
      position: exp.position || undefined,
      description: exp.description || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
    })),
    education: data.education.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
  };
}
