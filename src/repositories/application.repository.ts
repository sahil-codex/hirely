import { sql } from "@/lib/db";

export async function createApplication(userId:string,jobId:string) {
    const result= await sql`
    INSERT INTO applications (user_id,job_id)
    VALUES(${userId},${jobId})
    RETURNING*`;
    return result[0];
    
}

export async function checkExistingApplication(userId:string,jobId:string){
    const result = await sql`
    SELECT*FROM applications
    WHERE user_id = ${userId} AND job_id = ${jobId}`;
    return result[0];
}