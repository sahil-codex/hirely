import {NextResponse} from "next/server";
import { matchCandidatesServices } from "@/services/matching.service";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req:Request){
    try{
        const user = await getUserFromRequest(req);

        if(!user || user.role !== "RECRUITER"){
            return NextResponse.json(
                {error:"Only recruiters allowed"},
                {status:403}
            );
        }
        const {searchParams} = new URL(req.url);
        const jobId = searchParams.get("jobId");
        if(!jobId){
            return NextResponse.json(
                {error:"Job ID required"},
                {status:400}
            );
        }
        const results = await matchCandidatesServices(jobId);
        return NextResponse.json({candidates:results});
    }catch(err:any){
        return NextResponse.json(
            {error:err.message||"Something went wrong"},
            {status:500}
        );
    }
}