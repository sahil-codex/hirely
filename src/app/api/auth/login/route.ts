import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import {signToken} from "@/lib/auth";
import { NextResponse } from "next/server";
import { loginSchema } from "@/validators/auth.validator";

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

    const users = await sql`
    SELECT id,email,role,password_hash FROM users WHERE email = ${email.toLowerCase()}`;
    const user = users[0];
    if(!user){
        return NextResponse.json(
            {error:'Invalid credentials'},
            {status:401}
        )
    }
    const isValid = await bcrypt.compare(password,user.password_hash);
   if(!isValid){
    return NextResponse.json({error:'Invalid credentials'},
        {status:401}
    )
   }   
   const token = signToken({
    userId:user.id,
    role:user.role,
   });
   return NextResponse.json({
    token,
    user:{
        id:user.id,
        email:user.email,
        role:user.role,
    },
   });
}catch(err:any){
    return NextResponse.json(
        {error:err.message||"Something went wrong"},
        {status:500});
    }
}