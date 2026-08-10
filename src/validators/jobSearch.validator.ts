import {z} from "zod";

export const jobSearchSchema = z.object({
    keyword: z.string().trim().max(100,"Keyword too long").optional(),
    location: z.string().trim().max(100,"Location too long").optional(),

    minSalary:z
     .string()
     .transform((value) => {
      if (value === "") return undefined;

      return Number(value.replace(/,/g, ""));
    })
     .refine(
      (value) =>
        value === undefined ||
        (Number.isFinite(value) && value >= 0),
      {
        message: "Invalid minimum salary",
      }
    )
     .optional(),

     skills: z
     .string()
     .trim()
     .transform((value) =>
     {
      if (!value) return [];

      return value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    })

     .optional(),

     page: z
     .string()
     .trim()
     .transform((value)=>{
      if (!value) return 1;

      return Number(value);
    })
     .refine(
      (value) =>
        Number.isInteger(value) && value > 0,
      {
        message: "Page must be a positive integer",
      }
    )
     .optional(),
});