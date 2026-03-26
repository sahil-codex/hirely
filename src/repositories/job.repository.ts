import {sql} from "@/lib/db";

export async function createJob(data:{
    title:string;
    description:string;
    location?:string;
    salary?:number;
    skills?:string[];
    recruiterId:string;
}) {
    const result = await sql`
    INSERT INTO jobs (title,description,location,salary,skills,recruiter_id)
    VALUES(
    ${data.title},
    ${data.description},
    ${data.location || null},
    ${data.salary || null},
    ${data.skills || null},
    ${data.recruiterId})
    RETURNING*`;
    return result[0];
}