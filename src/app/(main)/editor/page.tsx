import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { ResumeServerData, resumeWithInclude } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}
export const metadata: Metadata = {
  title: "Design your resume",
};

async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;
  const { userId } = await auth();
  let dbResume: ResumeServerData | null = null;

  if (!userId) return null;

  if (resumeId) {
    dbResume = await prisma.resume.findUnique({
      where: { id: resumeId, userId },
      include: resumeWithInclude,
    });
  }

  return <ResumeEditor currentResume={dbResume} />;
}

export default Page;
