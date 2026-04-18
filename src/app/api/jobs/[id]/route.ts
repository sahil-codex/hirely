import { NextResponse,NextRequest } from "next/server";
import { deleteJobService } from "@/services/job.service";
import { getUserFromRequest } from "@/lib/getUser";

export async function DELETE( req:NextRequest,{ params }:{ params : {id:string }}) {
        try {
            const user = await getUserFromRequest();
            if(!user){
                return NextResponse.json({error:"Unauthorized"},{status:401});
            }
            const job = await deleteJobService(user,params.id);
            return NextResponse.json({ job });
        } catch(err:any){
            return NextResponse.json(
                {error:err.message || "Something went wrong"},
                { status:400}
            );
        }
     }
