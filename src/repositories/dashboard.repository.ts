import { sql } from "@/lib/db";

export async function getRecruiterStats(recruiterId:string){
    const totalJobs = await sql`
    SELECT COUNT(*) FROM jobs
    WHERE recruiter_id = ${recruiterId}`;
    
    const totalApplications = await sql`
    SELECT COUNT(*) FROM applications a 
    JOIN jobs ON a.job_id = j.id
    WHERE j.recruiter_id = ${recruiterId}`;
    
    const applicationsPerJob = await sql`
    SELECT j.id,j.title,COUNT(a.id) as applicatins
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.recruiter_id = ${recruiterId}
    GROUP BY j.id 
    ORDER BY applications DESC`;

    const statusBreakdown = await sql`
    SELECT a.status,COUNT (*) as count
    FROM applications a 
    JOIN jobs j ON a.job_id = j.id
    WHERE j.recruiter_id = ${recruiterId}
    GROUP BY a.status`;

    return {
        totalJobs:totalJobs[0].count,
        totalApplications:totalApplications[0].count,
        applicationsPerJob,
        statusBreakdown,
    };
}