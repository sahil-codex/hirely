import{
    createApplication,checkExistingApplication,
} from "@/repositories/application.repository";
import {getApplicationsByJob,updateApplicationsStatus,getApplicationsByUser} from "@/repositories/application.repository";
import {
  createNotificationService,
} from "@/services/notification.service";
export async function applyToJobService(user:any,jobId:string){
    if(user.role!=="CANDIDATE"){
        throw new Error("Only candidates can apply");
    }

    if(!jobId){
        throw new Error("Job ID is required");
    }

    const existing = await checkExistingApplication(user.userId,jobId);
        if(existing){
            throw new Error("You have already applied to this job");
        }
        return await createApplication(user.userId,jobId);
}

export async function getApplicationsForJobService(
  user: {
    userId: string;
    role: string;
  },
  jobId: string
) {
  if (user.role !== "RECRUITER") {
    throw new Error("Only recruiters allowed");
  }

  if (!jobId) {
    throw new Error("Job ID required");
  }

  return await getApplicationsByJob(
    jobId,
    user.userId
  );
}

export async function updateApplicationsStatusService(
  user: {
    userId: string;
    role: string;
  },
  applicationId: string,
  status: "SHORTLISTED" | "REJECTED"
) {
  if (user.role !== "RECRUITER") {
    throw new Error("Forbidden");
  }

  if (!applicationId) {
    throw new Error(
      "Application ID required"
    );
  }

  const result =
    await updateApplicationsStatus(
      applicationId,
      user.userId,
      status
    );

  const isShortlisted =
    status === "SHORTLISTED";

  await createNotificationService({
    userId: result.candidateId,

    title: isShortlisted
      ? "Application shortlisted"
      : "Application update",

    message: isShortlisted
      ? "Your application has been shortlisted by the recruiter."
      : "Your application was not selected for the next stage.",

    type: "APPLICATION_STATUS",
  });

  return result.application;
}

export async function getCandidateApplicationsService(user:{userId:string,role:string;}){
    if(user.role!=="CANDIDATE"){
        throw new Error("Only candidates allowed");
    }
    return await getApplicationsByUser(user.userId);
}