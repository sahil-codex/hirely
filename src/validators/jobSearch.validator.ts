import {z} from "zod";

export const jobSearchSchema = z.object({
    keyword: z.string().optional(),
    location: z.string().optional(),

    minSalary:z
     .string()
     .transform((val)=> Number(val.replace(/,/g, "")))
     .refine((val)=> !isNaN(val),{
        message:"Invalid salary",
     })
     .optional(),

     skills: z
     .string()
     .transform((val) =>
       val.split(",").map((s) => s.trim()).filter(Boolean)
     )
     .optional(),

     page: z
     .string()
     .transform((val)=>Number(val))
     .refine((val)=>val>0,{
        message:"Page must be positive",
     })
     .optional(),
});