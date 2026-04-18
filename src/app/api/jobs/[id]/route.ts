import { NextResponse,NextRequest } from "next/server";
import { deleteJobService } from "@/services/job.service";
import { getUserFromRequest } from "@/lib/getUser";

export async function DELETE( req:NextRequest,context:{ params:Promise<{id:string }>}) {
        try {
            const {id} = await context.params;
            const user = await getUserFromRequest();
            if(!user){
                return NextResponse.json({error:"Unauthorized"},{status:401});
            }
            const job = await deleteJobService(user,id);
            return NextResponse.json({ job });
        } catch(err:any){
            return NextResponse.json(
                {error:err.message || "Something went wrong"},
                { status:400}
            );
        }
     }
