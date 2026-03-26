import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import {signToken} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req){
   try{
    const {email,password} = await req.json();
    const users = await sql`
    SELECT * FROM users WHERE email = ${email.toLowerCase()}`;
    const user = users[0];
    if(!user){
        return NextResponse.json(
            {error:'Invalid credentials'},
            {status:401}
        )
    }
    const isValid = await bcrypt.compare(password,user.password_hash);
   if(!isValid){
    return NextResponse.json({error:'Invalid credentails'},
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
        role:user.role,
    },
   });
}catch(err){
    return NextResponse.json(
        {error:err.message},
        {status:500});
    }
}