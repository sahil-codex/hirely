import { NextResponse } from "next/server";
import { createJobService } from "@/services/job.service";
import { getUserFromRequest } from "@/lib/getUser";
import { createJobSchema } from "@/validators/job.validators";


export async function POST(req:Request){
    try{
        const user = await getUserFromRequest(req);

        if(!user){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        if (user.role !== "RECRUITER"){
            return NextResponse.json({error:"Forbidden"},{status:403});
        }

        const body = await req.json();
        const parsed = createJobSchema.safeParse(body);
        if(!parsed.success){
              return NextResponse.json(
                {error:parsed.error.issues},
                {status:400}
              );
        }
        const job = await createJobService(parsed.data,user.userId);
       return NextResponse.json({job});
    }catch(err:any){
        return NextResponse.json({
            error:err.message || "Something went wrong"},
            {status:500}
        );
    }
}