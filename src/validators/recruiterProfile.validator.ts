import { z } from "zod";

const emptyToUndefined = <T extends z.ZodTypeAny>(
  schema: T
) =>
  z.preprocess(
    (value) =>
      value === "" ? undefined : value,
    schema.optional()
  );

const urlSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    if (!value) return;

    try {
      new URL(value);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid URL",
      });
    }
  });

const linkedinSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    if (!value) return;

    try {
      const url = new URL(value);

      if (
        !url.hostname
          .toLowerCase()
          .includes("linkedin.com")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must be a LinkedIn URL",
        });
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid LinkedIn URL",
      });
    }
  });

export const recruiterProfileSchema =
  z.object({
    headline: emptyToUndefined(
      z
        .string()
        .trim()
        .min(3, "Headline too short")
        .max(120, "Headline too long")
    ),

    bio: emptyToUndefined(
      z
        .string()
        .trim()
        .max(
          1000,
          "Bio cannot exceed 1000 characters"
        )
    ),

    location: emptyToUndefined(
      z
        .string()
        .trim()
        .max(100, "Location too long")
    ),

    company: emptyToUndefined(
      z
        .string()
        .trim()
        .max(
          120,
          "Company name too long"
        )
    ),

    jobTitle: emptyToUndefined(
      z
        .string()
        .trim()
        .max(
          120,
          "Job title too long"
        )
    ),

    companyWebsite:
      emptyToUndefined(urlSchema),

    linkedinUrl:
      emptyToUndefined(linkedinSchema),
  });

export type RecruiterProfileInput =
  z.infer<typeof recruiterProfileSchema>;