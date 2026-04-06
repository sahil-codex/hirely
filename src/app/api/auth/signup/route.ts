import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { signupSchema } from '@/validators/auth.validator';
import { db } from '@/lib/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';


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

            const existingUser = await db
            .select({
                id:users.id})
                .from(users)
                .where(eq(users.email,email.toLowerCase()))
                .limit(1);
                   
            if(existingUser.length>0){
                return NextResponse.json(
                    {error:'User already exists'},
                    {status:409}
                );
            }
          
        const hashedPassword = await bcrypt.hash(password,10);
        
        const result = await db
         .insert(users)
         .values({
           email:email.toLowerCase(),
           passwordHash:hashedPassword,
           role,
        })
          .returning({
            id:users.id,
            email:users.email,
            role:users.role,
          });
        
         return NextResponse.json({user:result[0]});
        } catch(err){
            const message = err instanceof Error? err.message:'Something went wrong';
            return NextResponse.json({error:message},{status:500});
        }
    
}