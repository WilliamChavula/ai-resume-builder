import crypto from "crypto";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
