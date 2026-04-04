import {sql} from '@/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { signupSchema } from '@/validators/auth.validator';

export async function POST(req:Request){
    try{
         const body = await req.json();
         const parsed = signupSchema.safeParse(body);
           if(!parsed.success){
                return NextResponse.json(
                {error:parsed.error.issues},
                {status:400}
                );
            }
              const {email,password,role} = parsed.data;

            const existingUser = await sql`
            SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
            if(existingUser.length>0){
                return NextResponse.json(
                    {error:'User already exists'},
                    {status:409}
                );
            }
          
        const hashedPassword = await bcrypt.hash(password,10);
        
        const result = await sql`
         INSERT INTO users (email,password_hash,role)
         VALUES (${email.toLowerCase()},${hashedPassword},${role})
         RETURNING id,email,role`;
        
         return NextResponse.json({user:result[0]});
        } catch(err){
            const message = err instanceof Error? err.message:'Something went wrong';
            return NextResponse.json({error:message},{status:500});
        }
    
}