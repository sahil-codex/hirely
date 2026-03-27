import { NextResponse } from "next/server";
import { applyToJobService } from "@/services/application.service";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getUser(req:Request) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if(!token) return null;

    const {payload} = await jwtVerify(token,secret);
    return payload as{ userId:string ; role:string};
   
}

export async function POST(req:Request){
    try{
        const user = await getUser(req);
        if(!user){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        const {jobId} = await req.json();
        const application = await applyToJobService(user,jobId);
        return NextResponse.json({application});
    }catch(err:any){
        return NextResponse.json(
            {error: err.message|| "Something went wrong"},
            {status:400}
        );
    }
}