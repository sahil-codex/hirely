import { NextResponse } from "next/server";
import { getDashboardService } from "@/services/dashboard.service";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req:Request){
    try{
        const user = await getUserFromRequest(req);
      if(!user){
        return NextResponse.json({error:"Unauthorized"},{status:401});
      }
      const data = await getDashboardService(user);
      return NextResponse.json({dashboard:data});
    }catch(err:any){
      return NextResponse.json(
        {error:err.message|| "Something went wrong"},
        {status:400}
      );
    }
}