import { NextResponse} from "next/server";
import { getRecruiterjobsService } from "@/services/job.service";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req:Request){
    try{
        const user = await getUserFromRequest(req);
        if(!user){
            return NextResponse.json(
                {error:"Unauthorized"},
                {status:401}
            );
        }
        const jobs = await getRecruiterjobsService(user);
        return NextResponse.json({jobs});

    }catch(err:any){
        return NextResponse.json(
            {error:err.message||"Something went wrong"},
            {status:400}
        );
    }
}