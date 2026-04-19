import { NextResponse,NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { getApplicationsForJobService } from "@/services/application.service";

export async function GET(
    req:NextRequest,context:{params:Promise<{id:string}>}
){
    try{
        const {id} = await context.params;
        const user = await getUserFromRequest();
        if(!user){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        const applications = await getApplicationsForJobService(user,id);
        return NextResponse.json({applications});
    }catch(err:any){
        NextResponse.json(
            {error:err.message|| "Something went wrong"},
            {status:400}
        );
    }
}