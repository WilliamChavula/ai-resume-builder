import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export default createEnv({
  server: {
    DATABASE_URL: z.string().url({ message: "DATABASE_URL is required" }),
    POSTGRES_URL: z.string().url({ message: "POSTGRES_URL is required" }),
    POSTGRES_URL_NON_POOLING: z
      .string()
      .url({ message: "POSTGRES_URL_NON_POOLING is required" }),
    POSTGRES_USER: z.string({ message: "POSTGRES_USER is required" }),
    POSTGRES_HOST: z.string({ message: "POSTGRES_HOST is required" }),
    POSTGRES_PASSWORD: z.string({ message: "POSTGRES_PASSWORD is required" }),
    POSTGRES_DATABASE: z.string({ message: "POSTGRES_DATABASE is required" }),
    POSTGRES_URL_NO_SSL: z
      .string()
      .url({ message: "POSTGRES_URL_NO_SSL is required" }),
    POSTGRES_PRISMA_URL: z
      .string()
      .url({ message: "POSTGRES_PRISMA_URL is required" }),
    CLERK_SECRET_KEY: z
      .string()
      .nonempty({ message: "CLERK_SECRET_KEY is required" }),
    BLOB_READ_WRITE_TOKEN: z
      .string()
      .nonempty({ message: "BLOB_READ_WRITE_TOKEN is required" }),
    OPENAI_API_KEY: z
      .string()
      .nonempty({ message: "OPENAI_API_KEY is required" }),
    STRIPE_SECRET_KEY: z
      .string()
      .nonempty({ message: "STRIPE_SECRET_KEY is required" }),
    STRIPE_WEBHOOK_SECRET: z
      .string()
      .nonempty({ message: "STRIPE_SECRET_KEY is required" }),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
      .string()
      .nonempty({ message: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required" }),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z
      .string()
      .nonempty({ message: "NEXT_PUBLIC_CLERK_SIGN_IN_URL is required" }),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z
      .string()
      .nonempty({ message: "NEXT_PUBLIC_CLERK_SIGN_UP_URL is required" }),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
      .string()
      .nonempty({ message: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required" }),
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY: z.string().nonempty({
      message: "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY is required",
    }),
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY: z.string().nonempty({
      message: "NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY is required",
    }),
    NEXT_PUBLIC_BASE_URL: z
      .string()
      .url({ message: "NEXT_PUBLIC_BASE_URL is required" }),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
