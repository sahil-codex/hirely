import bcrypt from "bcryptjs";
import {signToken} from "@/lib/auth";
import { NextResponse } from "next/server";
import { loginSchema } from "@/validators/auth.validator";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export async function POST(req:Request){
   try{
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if(!parsed.success){
        return NextResponse.json(
            {error:parsed.error.issues},
            {status:400}
        );
    }
    const {email,password} = parsed.data;

    const result = await db
    .select({
        id:users.id,
        email:users.email,
        role:users.role,
        passwordHash:users.passwordHash,
    })
    .from(users)
    .where(eq(users.email,email.toLowerCase()))
    .limit(1);
    
    const user = result[0];
    
    if(!user){
        return NextResponse.json(
            {error:'Invalid credentials'},
            {status:401}
        )
    }
    const isValid = await bcrypt.compare(password,user.passwordHash);
   if(!isValid){
    return NextResponse.json({error:'Invalid credentials'},
        {status:401}
    )
   }   
   const token = signToken({
    userId:user.id,
    role:user.role,
   });
   const response = NextResponse.json({
    user:{
        id:user.id,
        email:user.email,
        role:user.role,
    },
   });
   response.cookies.set("token",token,{
    httpOnly:true,
    secure:true,
    sameSite:"lax",
    path:"/",
    maxAge:60*60*24*7
   });
   return response;
}catch(err:any){
    return NextResponse.json(
        {error:err.message||"Something went wrong"},
        {status:500});
    }
}