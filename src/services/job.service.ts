import {createJob} from "@/repositories/job.repository";

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