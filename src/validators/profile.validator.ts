
import { z } from "zod";

const baseProfileSchema = z.object({});

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional()
  );

const skillsSchema = z
  .array(
    z.string().trim().min(1, "Skill cannot be empty").max(30, "Skill too long")
  )
  .max(20, "Too many skills")
  .optional();

const githubSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    if (!value) return;

    try {
      const url = new URL(value);

      if (!url.hostname.includes("github.com")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must be a GitHub URL",
        });
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid GitHub URL",
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

      if (!url.hostname.includes("linkedin.com")) {
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

const portfolioSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    if (!value) return;

    try {
      new URL(value);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Portfolio URL",
      });
    }
  });

export const profileCreateSchema = baseProfileSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name too long"),

  headline: emptyToUndefined(
    z
      .string()
      .trim()
      .min(3, "Headline too short")
      .max(120, "Headline too long")
  ),

  bio: emptyToUndefined(
    z.string().trim().max(1000, "Bio cannot exceed 1000 characters")
  ),

  location: emptyToUndefined(
    z.string().trim().max(100, "Location too long")
  ),

  skills: skillsSchema,

  experience: z
    .coerce
    .number({
      error: "Experience must be a number",
    })
    .int("Experience must be a whole number")
    .min(0, "Experience cannot be negative")
    .max(50, "Experience too large")
    .optional(),

  company: emptyToUndefined(
    z.string().trim().max(120, "Company name too long")
  ),

  education: emptyToUndefined(
    z.string().trim().max(200, "Education too long")
  ),

  githubUrl: emptyToUndefined(githubSchema),

  linkedinUrl: emptyToUndefined(linkedinSchema),

  portfolioUrl: emptyToUndefined(portfolioSchema),

  resumeUrl: emptyToUndefined(
    z.string().trim().url("Invalid Resume URL")
  ),
});

export const profileUpdateSchema = profileCreateSchema.partial();

export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;