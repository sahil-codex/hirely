import { db } from "@/lib/drizzle";
import { profiles,jobs,users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getJobById(jobId:string) {
    const result = await db
     .select() .from(jobs) .where(eq(jobs.id,jobId)) .limit(1);
    return result[0]??null;
}

export async function getAllCandidates(){
    const result = await db
    .select({
    userId:profiles.userId,
    name:profiles.name,
    skills:profiles.skills,
    experience:profiles.experience,
    })
    .from(profiles)
    .innerJoin(users,eq(profiles.userId,users.id))
    .where(eq(users.role,"CANDIDATE"));
    return result;
}