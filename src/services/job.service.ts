import {createJob} from "@/repositories/job.repository";
import {searchJobs} from "@/repositories/job.repository";

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

    return await searchJobs({
        keyword:query.keyword,
        location:query.location,
        minSalary:query.minSalary
           ? Number (query.minSalary)
           : undefined,
        skills:query.skills ? query.skills.split(",") : undefined,
        limit,
        offset,
    });
    
}