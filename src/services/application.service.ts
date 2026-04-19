import{
    createApplication,checkExistingApplication,
} from "@/repositories/application.repository";
import {getApplicationsByJob} from "@/repositories/application.repository";

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
    user:{userId:string;role:string},
    jobId:string
){
    if(user.role!=="RECRUITER"){
        throw new Error("Only recruiters allowed");
    }
    if(!jobId){
        throw new Error("Job ID required");
    }
    return await getApplicationsByJob(jobId);
}