import {NextResponse} from "next/server";
import { matchCandidatesService } from "@/services/matching.service";
import { getUserFromRequest } from "@/lib/getUser";
import { matchQuerySchema } from "@/validators/matching.validator";

export async function GET(req:Request){
    try{
        const user = await getUserFromRequest();

        if(!user || user.role !== "RECRUITER"){
            return NextResponse.json(
                {error:"Forbidden"},
                {status:403}
            );
        }
        const {searchParams} = new URL(req.url);
        const query ={
              jobId:searchParams.get("jobId")
        }
        const parsed = matchQuerySchema.safeParse(query);

         if(!parsed.success){
            return NextResponse.json(
                {error: parsed.error.issues},
                {status:400}
            );
         }
         const {jobId} = parsed.data;
        const results = await matchCandidatesService(jobId);
        return NextResponse.json({candidates:results});
    }catch(err:any){
        return NextResponse.json(
            {error:err.message||"Something went wrong"},
            {status:500}
        );
    }
}