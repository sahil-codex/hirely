import { db } from "@/lib/drizzle";
import { applications} from "@/db/schema";
import {eq,and} from "drizzle-orm";

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