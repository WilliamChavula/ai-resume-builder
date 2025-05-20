"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";

import prisma from "@/lib/prisma";

export async function deleteResume(id: string): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw Error("User not authenticated");
  }

  const resume = await prisma.resume.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!resume) {
    throw Error("Resume not found");
  }

  if (resume.photoUrl) {
    await del(resume.photoUrl);
  }

  await prisma.resume.delete({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/resumes");
}
