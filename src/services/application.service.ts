import{
    createApplication,checkExistingApplication,
} from "@/app/api/jobs/route";

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