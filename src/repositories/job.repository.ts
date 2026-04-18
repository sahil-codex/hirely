
import { db } from "@/lib/drizzle";
import { jobs } from "@/db/schema";
import { eq,count,SQL,desc, arrayOverlaps,and, gte, ilike } from "drizzle-orm";

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
    const conditions:SQL[]=[];
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
    const baseQuery = 
    db
      .select({
        id:jobs.id,
        title:jobs.title,
        location:jobs.location,
        salary:jobs.salary,
        createdAt:jobs.createdAt,
      })
      .from(jobs)
      .orderBy(desc(jobs.createdAt))
      .limit(filters.limit)
      .offset(filters.offset);
      const jobsQuery = where ? baseQuery.where(where):baseQuery;
      const countQuery = where
       ?db.select({count:count()}).from(jobs).where(where)
       :db.select({count:count(jobs.id)}).from(jobs);
       const [jobsResult,countResult] = await Promise.all([
         jobsQuery,
         countQuery,
       ]);
       return {
        jobs:jobsResult,
        totalCount: Number(countResult[0].count??0),
       };
}

export async function getJobsRecruiter(recruiterId:string) {
    const result = await db
    .select({
        id:jobs.id,
        title:jobs.title,
        location:jobs.location,
        salary:jobs.salary,
        createdAt:jobs.createdAt,
    })
       .from(jobs)
       .where(eq(jobs.recruiterId,recruiterId))
       .orderBy(desc(jobs.createdAt));
      return result;
}

export async function deleteJobById(jobId:string,recruiterId:string){
    const result = await db 
       .delete(jobs)
       .where(
        and(
            eq(jobs.id,jobId),
            eq(jobs.recruiterId,recruiterId)
        )
       )
       .returning();
       return result[0];
}