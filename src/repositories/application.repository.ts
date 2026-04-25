import { db } from "@/lib/drizzle";
import { applications,users} from "@/db/schema";
import {eq,and} from "drizzle-orm";


export async function getApplicationsByJob(jobId:string){
    const result = await db 
     .select({
        id: applications.id,
        status: applications.status,
        createdAt: applications.createdAt,

        userId:users.id,
        email:users.email,
     })
     .from (applications)
     .innerJoin(users,eq(applications.userId,users.id))
     .where(eq(applications.jobId,jobId));
     return result;
}
export async function createApplication(userId:string,jobId:string) {
    const result= await db
    .insert(applications)
    .values({
        userId,
        jobId,
    })
    .returning();
    return result[0];
    
}

export async function checkExistingApplication(userId:string,jobId:string){
    const result = await db
    .select()
    .from(applications)
    .where(and(
        eq(applications.userId,userId),
        eq(applications.jobId,jobId)
    ))
    .limit(1);
    return result[0];
}

export async function updateApplicationsStatus(
    applicationId:string,status:"SHORTLISTED"|"REJECTED"
){
    const result = await db
    .update(applications)
    .set({status})
    .where(eq(applications.id,applicationId))
    .returning();

    if(!result.length){
        throw new Error("Application not found");
    }
    return result[0];
}