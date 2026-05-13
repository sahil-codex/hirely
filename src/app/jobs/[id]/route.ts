import { NextResponse,NextRequest } from "next/server";
import { getJobDetailsService } from "@/services/job.service";

export async function GET(
    req: NextRequest,
    context:{params:Promise<{id:string}>}
){
    try{
        const {id} = await context.params;
        const job = await getJobDetailsService(id);
        return NextResponse.json({job});
    }catch(err:any){
        return NextResponse.json(
            {error:err.message||"Something went wrong"},
            {status:404}
        );
    }
}
