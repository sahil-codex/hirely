import { searchJobsService } from "@/services/job.service";
import { NextResponse } from "next/server";
import { jobSearchSchema } from "@/validators/jobSearch.validator";

export async function GET(req:Request){
    try{
        const {searchParams} = new URL(req.url);
        const query ={
            keyword:searchParams.get("keyword") ?? undefined,
            location:searchParams.get("location") ?? undefined,
            minSalary:searchParams.get("minSalary") ?? undefined,
            skills:searchParams.get("skills") ?? undefined,
            page:searchParams.get("page") ?? undefined,
        };
         const parsed = jobSearchSchema.safeParse(query);

         if(!parsed.success){
            return NextResponse.json(
                {error:parsed.error.issues},
                {status:400}
            );
         }
        const jobs = await searchJobsService(parsed.data);
        return NextResponse.json({jobs});

    }catch(err:any){
          return NextResponse.json(
            {error :err.message || "Something went wrong"},
            {status:500}
          );
    }
    
}