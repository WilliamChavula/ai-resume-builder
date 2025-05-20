"use server";

import {
  generateSummarySchema,
  generateWorkExperienceSchema,
  TGenerateSummary,
  TGenerateWorkExperience,
  TWorkExperience,
} from "@/lib/validation";
import openai from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { canUseAITools } from "@/lib/permissions";
import { getUserSubscriptionTier } from "@/lib/subscription";

export const generateSummary = async (input: TGenerateSummary) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionTier = await getUserSubscriptionTier(userId);

  if (!canUseAITools(subscriptionTier)) {
    throw new Error("AI Tools not available on current tier");
  }

  const { jobTitle, workExperience, education, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
  Given a candidate's information about their skills and qualifications. Generate a resume summary fitting their bio.
  Make it concise, professional, and relevant.
  `;

  const userMessage = `
  Please generate a high quality, professional resume summary from this data:
  
  Job Title: ${jobTitle || "N/A"}
  
  WorkExperience: ${workExperience
    ?.map(
      (exp) => `
  Position: ${exp.position || "N/A"} at ${exp.company} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}
  Description: ${exp.description || "N/A"}
  `,
    )
    .join("\n\n")}
    
  Education: ${education
    ?.map(
      (edu) => `
  Degree: ${edu.degree || "N/A"} at ${edu.school} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
  `,
    )
    .join("\n\n")}
    
    Skills: ${skills}
  `;

  const completions = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completions.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI Response");
  }

  return aiResponse;
};

export const generateWorkExperience = async (
  input: TGenerateWorkExperience,
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const subscriptionTier = await getUserSubscriptionTier(userId);

  if (!canUseAITools(subscriptionTier)) {
    throw new Error("AI Tools not available on current tier");
  }
  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  Given a candidate's work experience description. Use this description to generate a detailed job title, description, start and end dates, and the company the user worked at.
  What you generate must be relevant to the description, concise, clear, professional, and make the candidate standout as an applicant. Again, make it concise, professional, detailed, clear, and relevant.
  Use only information provided, don't try to fill in the gaps.
  
  Job title: [job title]
  Company: [company name]
  Start date: [format: YYYY-MM-DD] (only if provided)
  End date: [format: YYYY-MM-DD] (only if provided)
  Description: [An optimized description with bullet points can be inferred from the job title]
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;

  const completions = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completions.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI Response");
  }

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies TWorkExperience;
};
