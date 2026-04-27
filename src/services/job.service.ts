import {createJob, getJobsRecruiter} from "@/repositories/job.repository";
import {searchJobs} from "@/repositories/job.repository";
import { deleteJobById,getJobById } from "@/repositories/job.repository";

export async function createJobService(body:any,recruiterId:string){
    const{title,description,location,salary,skills} = body;

    if(!title || !description){
        throw new Error("Title and description are required");
    }

    return await createJob({
        title,
        description,
        location,
        salary,
        skills,
        recruiterId,
    });
}

export async function searchJobsService(query:any) {
    const page = Number(query.page || 1);
    const limit = 10;
    const offset = (page-1)*limit;

    const {jobs,totalCount} =  await searchJobs({
        keyword:query.keyword,
        location:query.location,
        minSalary:query.minSalary
           ? Number (query.minSalary)
           : undefined,
        skills:query.skills ? query.skills.split(",") : undefined,
        limit,
        offset,
    });
    
    const totalPages = Math.ceil(totalCount / limit);
    return {
        jobs,
        totalCount,
        totalPages,
        currentPage:page,
    };
}

export async function getRecruiterjobsService(user:{
    userId:string;
    role:string;
}){
    if(user.role!=="RECRUITER"){
        throw new Error("Only recruiters can access their jobs");
    }
    const jobs = await getJobsRecruiter(user.userId);
    return jobs;
}

export async function deleteJobService(
    user: {userId: string;role:string},
    jobId:string
) {
    if(user.role!=="RECRUITER"){
        throw new Error("Only recruiters can delete jobs");
    }
    if(!jobId){
        throw new Error("Job ID required");
    }
    const deleted = await deleteJobById(jobId,user.userId);

    if(!deleted){
        throw new Error("Job not found or unauthorized");
    }
    return deleted;
}

export async function getJobDetailsService(jobId:string){
     if(!jobId){
        throw new Error("Job ID required");
     }
     const job = await getJobById(jobId);
     if(!job){
        throw new Error("Job not found");
     }
     return job;
}