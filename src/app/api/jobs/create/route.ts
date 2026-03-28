import { NextResponse } from "next/server";
import { createJobService } from "@/services/job.service";
import { jwtVerify } from "jose";


const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function getUSerFromRequest(req:Request){
    const authHeader = req.headers.get("authorizaton");
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
        const body = await req.json();
        const job = await createJobService(body,user.userId);
       return NextResponse.json({job});
    }catch(err:any){
        return NextResponse.json({
            error:err.message || "Something went wrong"},
            {status:500}
        );
    }
}