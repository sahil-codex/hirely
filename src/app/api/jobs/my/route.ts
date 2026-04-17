import { NextResponse} from "next/server";
import { getRecruiterjobsService } from "@/services/job.service";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req:Request){
    try{
        const user = await getUserFromRequest();
        if(!user || user.role!=="RECRUITER"){
            return NextResponse.json(
                {error:"Forbidden"},
                {status:403}
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