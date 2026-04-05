
import { db } from "@/lib/drizzle";
import { jobs } from "@/db/schema";
import { desc, arrayOverlaps,and, gte, ilike } from "drizzle-orm";

export async function createJob(data:{
    title:string;
    description:string;
    location?:string;
    salary?:number;
    skills?:string[];
    recruiterId:string;
}) {
    const result = await db
    .insert(jobs)
    .values({
    title:data.title,
    description:data.description,
    location:data.location ?? null,
    salary:data.salary ?? null,
    skills:data.skills ?? [],
    recruiterId:data.recruiterId,
    }).returning();
    return result[0];
}

export async function searchJobs(filters:{
    keyword?:string;
    location?:string;
    minSalary?:number;
    skills?:string[];
    limit:number;
    offset:number;
}) {
    const conditions=[];
    if(filters.keyword){
        conditions.push(ilike(jobs.title, `%${filters.keyword}%`));
    }
    if(filters.location){
        conditions.push(ilike(jobs.location, `%${filters.location}%`));
    }
    if(filters.minSalary !==undefined){
        conditions.push(gte(jobs.salary,filters.minSalary));
    }
    if(filters.skills && filters.skills.length >0){
        conditions.push(arrayOverlaps(jobs.skills,filters.skills));
    }

   const where = conditions.length > 0 ? and(...conditions):undefined;
   const [jobsResult,countResult] = await Promise.all([
    db
      .select({
        id:jobs.id,
        title:jobs.title,
        location:jobs.location,
        salary:jobs.salary,
        createdAt:jobs.createdAt,
      })
      .from(jobs)
      .where(where)
      .orderBy(desc(jobs.createdAt))
      .limit(filters.limit)
      .offset(filters.offset),

      db
       .select({count:db.$count(jobs)})
       .from(jobs)
       .where(where),
    ]);
      const totalCount = Number(countResult[0].count??0);
       return  {jobs:jobsResult,totalCount};
}