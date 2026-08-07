import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { candidateProfiles } from "@/db/schema";
const baseSchema = createInsertSchema(candidateProfiles);

const skillsSchema = z 
   .array(
    z.string()
        .trim()
        .min(1,"Skill cannot be empty")
        .max(30,"Skill too long")
    )
    .max(20,"Too many skills")
    .optional();

    export const profileSchema = baseSchema.extend({
        fullName:z
        .string()
        .trim()
        .min(2,"Full name must be at least 2 characters")
        .max(100 , "Full name too long")
        .optional(),
        
        headline: z
        .string()
        .trim()
        .min(3,"Headline too short")
        .max(120,"Headline too long")
        .optional(),

        bio:z 
        .string()
        .trim()
        .max(1000,"Bio cannot exceed 1000 characters")
        .optional(),

        location: z
        .string()
        .trim()
        .max(100,"Location too long")
        .optional(),
        
        skills:skillsSchema,

        experience:z 
        .coerce
        .number({
            error:"Experience must be a number",
        })
        .int("Experience must be whole number")
        .min(0,"Experience cannot be negative")
        .max(50,"Experience too large")
        .optional(),

        company:z
        .string()
        .trim()
        .max(120,"Company name too long")
        .optional(),

        education:z
        .string()
        .trim()
        .max(200,"Education too large")
        .optional(),

       githubUrl: z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
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
  }),

        linkedinUrl: z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
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
  }),

        resumeUrl:z
         .string()
         .trim()
         .url("Invalid resume URL")
         .optional()
         .or(z.literal("")),
    });


    export type ProfileInput =
     Omit<
    z.infer<typeof profileSchema>,
     "userId">;