import {db} from "@/lib/drizzle"
import { candidateProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProfileByUserId(userId:string){
    const result = await db
    .select()
    .from(candidateProfiles) 
    .where(eq(candidateProfiles.userId,userId))
    .limit(1);
    return result [0] || null;
}

type ProfileData = {
    fullName?:string;
    headline?:string;
    bio?:string;
    location?:string;
    skills?:string[];
    experience?:number;
    company?:string;
    education?:string;
    resumeUrl?:string;
}
export async function createProfile(data:{
    userId:string;
     
}&ProfileData){
    const result = await db
    .insert(candidateProfiles)
    .values({
        userId:data.userId,
        fullName:data.fullName,
        headline:data.headline,
        bio:data.bio,
        location:data.location,
        skills:data.skills||[],
        experience:data.experience,
        company:data.company,
        education:data.education,
        resumeUrl:data.resumeUrl,
    })
    .returning();
    return result[0];
}

export async function updateProfile(
    userId:string,
    data:ProfileData
){
    const result = await db
    .update(candidateProfiles)
    .set({
        ...data,
        updatedAt:new Date(),
    })
    .where(eq(candidateProfiles.userId,userId))
    .returning();
    return result[0];
}

export async function updateResumeUrl(
  userId: string,
  resumeUrl: string
) {
  const result = await db
    .update(candidateProfiles)
    .set({
      resumeUrl,
      updatedAt: new Date(),
    })
    .where(eq(candidateProfiles.userId, userId))
    .returning();

  return result[0];
}