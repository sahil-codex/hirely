import { NextResponse } from "next/server";
import { getDashboardService } from "@/services/dashboard.service";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req:Request){
    try{
        const user = await getUserFromRequest(req);
      if(!user || user.role !=="RECRUITER"){
        return NextResponse.json({error:"Forbidden"},{status:403});
      }
      const data = await getDashboardService(user);
      return NextResponse.json({dashboard:data});
    }catch(err:any){
      return NextResponse.json(
        {error:err.message|| "Something went wrong"},
        {status:500}
      );
    }
}