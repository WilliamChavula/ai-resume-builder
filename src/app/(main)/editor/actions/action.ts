"use server";

import path from "path";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";

import { resumeFormSchema, TResumeFormValues } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { generateName } from "@/lib/utils";

export async function saveResume(resume: TResumeFormValues) {
  const { userId } = await auth();
  const { id } = resume;

  console.log(`Received Data: ${resume}`);

  const { photo, workExperience, education, ...rest } =
    resumeFormSchema.parse(resume);

  if (!userId) throw new Error("Unauthorized: User not authenticated");

  // Todo: Check resume count for non-premium users

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) throw new Error("Resume not found");

  let newPhotoUrl: string | null | undefined = undefined;

  if (photo && photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    const name = generateName();
    const blob = await put(
      `resume_photo/${name}${path.extname(photo.name)}`,
      photo,
      {
        access: "public",
      },
    );

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }
    newPhotoUrl = null;
  }

  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...rest,
        photoUrl: newPhotoUrl,
        workExperience: {
          deleteMany: {},
          createMany: {
            data:
              workExperience?.map((exp) => ({
                ...exp,
                startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                endDate: exp.endDate ? new Date(exp.endDate) : undefined,
              })) || [],
          },
        },
        education: {
          deleteMany: {},
          createMany: {
            data:
              education?.map((edu) => ({
                ...edu,
                startDate: edu.startDate ? new Date(edu.startDate) : undefined,
                endDate: edu.endDate ? new Date(edu.endDate) : undefined,
              })) || [],
          },
        },
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...rest,
        userId,
        photoUrl: newPhotoUrl,
        workExperience: {
          createMany: {
            data:
              workExperience?.map((exp) => ({
                ...exp,
                startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                endDate: exp.endDate ? new Date(exp.endDate) : undefined,
              })) || [],
          },
        },
        education: {
          createMany: {
            data:
              education?.map((edu) => ({
                ...edu,
                startDate: edu.startDate ? new Date(edu.startDate) : undefined,
                endDate: edu.endDate ? new Date(edu.endDate) : undefined,
              })) || [],
          },
        },
      },
    });
  }
}
