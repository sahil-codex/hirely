import { NextResponse } from "next/server";
import { applyToJobService } from "@/services/application.service";
import { getUserFromRequest } from "@/lib/getUser";


export async function POST(req:Request) {
    try{
    const user = await getUserFromRequest();

    if(!user){
        return NextResponse.json(
        {error:"Unauthorized"},
        {status:401}
      );
    }
     if(user.role !=="CANDIDATE"){
        return NextResponse.json(
            {error: "Forbidden"},
            {status:403 }
        );    
     }
     const {jobId} = await req.json();

     if(!jobId){
        return NextResponse.json(
        {error:"Job ID required"},
        {status:400}
        );
     }
     const application = await applyToJobService(user,jobId);
     return NextResponse.json({application});
  } catch(err:any){
     return NextResponse.json(
        {error:err.message|| "Something went wrong"},
        {status:500}
     );
  }
}