import { Metadata } from "next";

import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { resumeWithInclude } from "@/lib/types";

import ResumeItem from "@/app/(main)/resumes/ResumeItem";
import CreateResumeButton from "@/app/(main)/resumes/components/CreateResumeButton";
import { getUserSubscriptionTier } from "@/lib/subscription";
import { canCreateResume } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Your resumes",
};

async function Page() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const [resumes, totalCount, subscriptionTier] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeWithInclude,
    }),
    prisma.resume.count({ where: { userId } }),
    getUserSubscriptionTier(userId),
  ]);

  // Todo: Check quota for non-premium users

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <CreateResumeButton
        canCreate={canCreateResume(subscriptionTier, totalCount)}
      />
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your resumes</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
        {resumes.map((resume) => (
          <ResumeItem resume={resume} key={resume.id} />
        ))}
      </div>
    </main>
  );
}

export default Page;
