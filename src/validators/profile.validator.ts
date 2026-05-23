import { z } from "zod";

const skillsSchema = z 
   .array(
    z.string()
        .trim()
        .min(1,"Skill cannot be empty")
        .max(30,"Skill too long")
    )
    .max(20,"Too many skills")
    .optional();

    export const profileSchema = z.object({
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

        education:z.string()
        .trim()
        .max(200,"Education too large")
        .optional(),

        resumeUrl:z
         .string()
         .trim()
         .url("Invalid resume URL")
         .optional(),
    });
