import { NextResponse } from "next/server";
import { createJobService } from "@/services/job.service";
import { jwtVerify } from "jose";
import { createJobSChema } from "@/validators/job.validators";


const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getUSerFromRequest(req:Request){
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split (" ")[1];

    if(!token)return null;
    const {payload} = await jwtVerify(token,secret);
    return payload as {userId:string;role:string};
}
export async function POST(req:Request){
    try{
        const user = await getUSerFromRequest(req);

        if(!user){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        if (user.role !== "RECRUITER"){
            return NextResponse.json({error:"Forbidden"},{status:403});
        }

        const body = await req.json();
        const parsed = createJobSChema.safeParse(body);
        if(!parsed.success){
              return NextResponse.json(
                {error:parsed.error.issues},
                {status:400}
              );
        }
        const job = await createJobService(body,user.userId);
       return NextResponse.json({job});
    }catch(err:any){
        return NextResponse.json({
            error:err.message || "Something went wrong"},
            {status:500}
        );
    }
}