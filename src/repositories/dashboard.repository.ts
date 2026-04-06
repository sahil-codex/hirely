import { db } from "@/lib/drizzle"
import { count,eq,desc } from "drizzle-orm"
import { jobs,applications } from "@/db/schema";
export async function getRecruiterStats(recruiterId:string){
    const totalJobsPromise =  db
     .select({count:count(jobs.id)}) .from(jobs)
     .where(eq(jobs.recruiterId,recruiterId));
    
    const totalApplicationsPromise = db
    .select({count:count()})
    .from(applications)
    .innerJoin(jobs,eq(applications.jobId,jobs.id)) 
    .where(eq(jobs.recruiterId,recruiterId));
    
    const applicationsPerJobPromise = db 
    .select({
        jobId:jobs.id,
        title:jobs.title,
        applications:count(applications.id),
    }) 
    .from(jobs)
    .leftJoin(applications,eq(jobs.id,applications.jobId))
    .where(eq(jobs.recruiterId,recruiterId))
    .groupBy(jobs.id,jobs.title)
    .orderBy(desc(count(applications.id)));

    const statusBreakdownPromise = db
     .select({
        status:applications.status,
        count:count(),
    })
    .from(applications)
    .innerJoin(jobs,eq(applications.jobId,jobs.id))
    .where(eq(jobs.recruiterId,recruiterId))
    .groupBy(applications.status);
     
    const[
        totalJobsResult,
        totalApplicationsResult,
        applicationsPerJob,
        statusBreakdown,

    ] = await Promise.all([
        totalJobsPromise,
        totalApplicationsPromise,
        applicationsPerJobPromise,
        statusBreakdownPromise,
    ]);
    return {
        totalJobs:Number(totalJobsResult[0]?.count??0),
        totalApplications:Number(totalApplicationsResult[0]?.count??0),
        applicationsPerJob,
        statusBreakdown,
    };
}