import { db } from "@/lib/drizzle";
import { applications,users,jobs,candidateProfiles} from "@/db/schema";
import {eq,and,desc} from "drizzle-orm";
import {
  createNotificationService,
} from "@/services/notification.service";

export async function getApplicationsByJob(
  jobId: string,
  recruiterId: string
) {
  const result = await db
    .select({
      applicationId: applications.id,
      status: applications.status,
      appliedAt: applications.createdAt,

      candidate: {
        id: users.id,
        fullName: users.fullName,
        email: users.email,

        headline: candidateProfiles.headline,
        location: candidateProfiles.location,
        skills: candidateProfiles.skills,
        experience: candidateProfiles.experience,
        education: candidateProfiles.education,
        resumeUrl: candidateProfiles.resumeUrl,
      },
    })
    .from(applications)

    .innerJoin(
      jobs,
      eq(applications.jobId, jobs.id)
    )

    .innerJoin(
      users,
      eq(applications.userId, users.id)
    )

    .leftJoin(
      candidateProfiles,
      eq(
        applications.userId,
        candidateProfiles.userId
      )
    )

    .where(
      and(
        eq(applications.jobId, jobId),
        eq(jobs.recruiterId, recruiterId)
      )
    )

    .orderBy(desc(applications.createdAt));

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
  applicationId: string,
  recruiterId: string,
  status: "SHORTLISTED" | "REJECTED"
) {
  const application = await db
    .select({
      applicationId: applications.id,
       candidateId: applications.userId,
    })
    .from(applications)
    .innerJoin(
      jobs,
      eq(applications.jobId, jobs.id)
    )
    .where(
      and(
        eq(applications.id, applicationId),
        eq(jobs.recruiterId, recruiterId)
      )
    )
    .limit(1);

  if (!application[0]) {
    throw new Error(
      "Application not found or unauthorized"
    );
  }

  const result = await db
    .update(applications)
    .set({ status })
    .where(
      eq(applications.id, applicationId)
    )
    .returning();

  return {
    application:result[0],
    candidateId:application[0].candidateId,
};
}
export async function getApplicationsByUser(userId:string){
    const result = await db
     .select({
        id:applications.id,
        status:applications.status,
        createdAt:applications.createdAt,

        jobId:jobs.id,
        title:jobs.title,
        location:jobs.location,
        salary:jobs.salary,
     })
     .from(applications)
     .innerJoin(jobs,eq(applications.jobId,jobs.id))
     .where(eq(applications.userId,userId))
     .orderBy(desc(applications.createdAt));

     return result;
}