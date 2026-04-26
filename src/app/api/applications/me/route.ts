import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { getCandidateApplicationsService } from "@/services/application.service";

export async function GET(req:Request){
    try{
        const user = await getUserFromRequest()
        if(!user){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            );
        }
        const applications = await getCandidateApplicationsService(user);
        return NextResponse.json({applications});
    }catch(err:any){
        return NextResponse.json(
            {error:err.message || "Something went wrong"},
            {status:400}
        );
    }
}