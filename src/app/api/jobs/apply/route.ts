import { NextResponse } from "next/server";
import { applyToJobService } from "@/services/application.service";
import { getUserFromRequest } from "@/lib/getUser";


export async function POST(req:Request) {
    try{
    const user = await getUserFromRequest(req);

    if(!user){
        return NextResponse.json(
        {error:"Unauthorized"},
        {status:401}
      );
    }
     if(user.role !=="CANDIDATE"){
        return NextResponse.json(
            {error: err.message || "Something went wrong"},
            {status:500 }
        )     
     }
  }