import { NextRequest,NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";

import {
    getProfileService,
    saveProfileService,
} from "@/services/profile.service";
import { profileUpdateSchema } from "@/validators/profile.validator";

export async function GET(req:NextRequest){
    try{
        const user = await getUserFromRequest();
        if(!user){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            );
        }
        const profile = await getProfileService(user);
        return NextResponse.json({ profile });
    } catch (err:unknown){
        return NextResponse.json(
        {error: err instanceof Error ? err.message : "Something went wrong"},
        {status:500}    
    );
    }
}

export async function PATCH(req:NextRequest){
    try{
        const user = await getUserFromRequest();
        if(!user){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            );
        }
        const body = await req.json();
        console.log("Incoming body:",body);

        const parsed = profileUpdateSchema.safeParse(body);
        if(!parsed.success){
            return NextResponse.json(
                {error:parsed.error.flatten()},
                {status:400}
            );
        }
            const profile = await saveProfileService(
                user,parsed.data
            );
            return NextResponse.json({ profile });
        } catch(err:unknown){
            return NextResponse.json(
                {error: err instanceof Error ? err.message : "Something went wrong"},
                {status:500}
        );
        }
    }
