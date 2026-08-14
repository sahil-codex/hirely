import { db } from "@/lib/drizzle";
import { savedJobs, jobs } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function saveJob(
  userId: string,
  jobId: string
) {
  const result = await db
    .insert(savedJobs)
    .values({
      userId,
      jobId,
    })
    .onConflictDoNothing({
      target: [
        savedJobs.userId,
        savedJobs.jobId,
      ],
    })
    .returning();

  return result[0] ?? null;
}

export async function unsaveJob(
  userId: string,
  jobId: string
) {
  const result = await db
    .delete(savedJobs)
    .where(
      and(
        eq(savedJobs.userId, userId),
        eq(savedJobs.jobId, jobId)
      )
    )
    .returning();

  return result[0] ?? null;
}

export async function isJobSaved(
  userId: string,
  jobId: string
) {
  const result = await db
    .select({
      id: savedJobs.id,
    })
    .from(savedJobs)
    .where(
      and(
        eq(savedJobs.userId, userId),
        eq(savedJobs.jobId, jobId)
      )
    )
    .limit(1);

  return !!result[0];
}

export async function getSavedJobsByUser(
  userId: string
) {
  return await db
    .select({
      savedJobId: savedJobs.id,

      jobId: jobs.id,
      title: jobs.title,
      description: jobs.description,
      location: jobs.location,
      salary: jobs.salary,
      skills: jobs.skills,

      savedAt: savedJobs.createdAt,
    })
    .from(savedJobs)
    .innerJoin(
      jobs,
      eq(savedJobs.jobId, jobs.id)
    )
    .where(eq(savedJobs.userId, userId))
    .orderBy(desc(savedJobs.createdAt));
}