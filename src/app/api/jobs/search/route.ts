import { searchJobsService } from "@/services/job.service";
import { NextResponse } from "next/server";

export async function GET(req:Request){
    try{
        const {searchParams} = new URL(req.url);
        const query ={
            keyword:searchParams.get("keyword"),
            location:searchParams.get("location"),
            minSalary:searchParams.get("minSalary"),
            skills:searchParams.get("skills"),
            page:searchParams.get("page"),
        };
        const jobs = await searchJobsService(query);
        return NextResponse.json({jobs});

    }catch(err:any){
          return NextResponse.json(
            {error :err.message || "Something went wrong"},
            {status:500}
          );
    }
    
}