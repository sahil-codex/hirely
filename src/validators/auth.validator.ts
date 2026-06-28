import  {z} from "zod";

export const signupSchema = z.object({
    fullName:z.string().trim().min(2,{message:"Full name must be at least 2 characters"}),
    email:z.string().trim().email({message:"Invalid email format"}),
    password:z.string().min(6,{message:"Password must be at least 6 characters"}),
    role:z.enum(["CANDIDATE","RECRUITER"]),
});

export const loginSchema = z.object({
    email:z.string().trim().email({message:"Invalid email format"}),
    password:z.string().min(1,{message:"Password is required"}), 
});


export type SignupInput =
  z.infer<typeof signupSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;