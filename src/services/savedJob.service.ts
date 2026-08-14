import {
  saveJob,
  unsaveJob,
  isJobSaved,
  getSavedJobsByUser,
} from "@/repositories/savedJob.repository";

import { db } from "@/lib/drizzle";
import { jobs } from "@/db/schema";
import { eq } from "drizzle-orm";

type AuthUser = {
  userId: string;
  role: string;
};

function requireCandidate(user: AuthUser) {
  if (user.role !== "CANDIDATE") {
    throw new Error(
      "Only candidates can save jobs"
    );
  }
}

export async function saveJobService(
  user: AuthUser,
  jobId: string
) {
  requireCandidate(user);

  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const job = await db
    .select({
      id: jobs.id,
    })
    .from(jobs)
    .where(eq(jobs.id, jobId))
    .limit(1);

  if (!job[0]) {
    throw new Error("Job not found");
  }

  await saveJob(user.userId, jobId);

  return {
    saved: true,
  };
}

export async function unsaveJobService(
  user: AuthUser,
  jobId: string
) {
  requireCandidate(user);

  if (!jobId) {
    throw new Error("Job ID is required");
  }

  await unsaveJob(user.userId, jobId);

  return {
    saved: false,
  };
}

export async function getJobSavedStatusService(
  user: AuthUser,
  jobId: string
) {
  requireCandidate(user);

  if (!jobId) {
    throw new Error("Job ID is required");
  }

  const saved = await isJobSaved(
    user.userId,
    jobId
  );

  return {
    saved,
  };
}

export async function getSavedJobsService(
  user: AuthUser
) {
  requireCandidate(user);

  return await getSavedJobsByUser(
    user.userId
  );
}