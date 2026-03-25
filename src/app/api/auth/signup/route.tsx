import {sql} from '@/src/lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';


export async function POST(req:Request){
    try{
        const{email,password,role} = await req.json();
        
        if(!email||!password||!role){
            return NextResponse.json({error:'Missing fields'},{status:400});

        }

        const hashedPassword = await bcrypt.hash(password,10);

        const result = await sql`
         INSERT INTO users (email,password_hash,role)
         VALUES (${email.toLowerCase()},${hashedPassword},${role})
         RETURNING IdleDeadline,email,role)`;
        
         return NextResponse.json({user:result[0]});
        } catch(err){
            const message = err instanceof Error? err.message:'Something went wrong';
            return NextResponse.json({error:message},{status:500});
        }
    
}