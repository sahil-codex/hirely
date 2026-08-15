import { db } from "@/lib/drizzle";
import { recruiterProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export type RecruiterProfileData = {
  headline?: string;
  bio?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  companyWebsite?: string;
  linkedinUrl?: string;
};

export async function getRecruiterProfileByUserId(
  userId: string
) {
  const result = await db
    .select()
    .from(recruiterProfiles)
    .where(eq(recruiterProfiles.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function createRecruiterProfile(
  data: {
    userId: string;
  } & RecruiterProfileData
) {
  const result = await db
    .insert(recruiterProfiles)
    .values({
      userId: data.userId,
      headline: data.headline,
      bio: data.bio,
      location: data.location,
      company: data.company,
      jobTitle: data.jobTitle,
      companyWebsite: data.companyWebsite,
      linkedinUrl: data.linkedinUrl,
    })
    .returning();

  return result[0];
}

export async function updateRecruiterProfile(
  userId: string,
  data: RecruiterProfileData
) {
  const result = await db
    .update(recruiterProfiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(recruiterProfiles.userId, userId))
    .returning();

  return result[0];
}