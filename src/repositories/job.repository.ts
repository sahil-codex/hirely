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

export async function searchJobs(filters:{
    keyword?:string;
    location?:string;
    minSalary?:number;
    skills?:string[];
    limit:number;
    offset:number;
}) {
    const conditions:any[]=[];
    if(filters.keyword){
        conditions.push(sql`title ILIKE ${"%" + filters.keyword + "%"}`);
    }
    if(filters.location){
        conditions.push(sql`location ILIKE ${"%" + filters.location + "%"}`);
    }
    if(filters.minSalary){
        conditions.push(sql `salary >= ${filters.minSalary}`);
    }
    if(filters.skills && filters.skills.length >0){
        conditions.push(sql`skills && ${filters.skills}`);
    }

    let whereClause = sql``;
      if(conditions.length>0){
        whereClause = sql`WHERE ${conditions.reduce((prev,curr,i)=>i===0?curr:sql`${prev} AND ${curr}`)}`;
      }
      const result = await sql`
     SELECT id,title,location,salary,created_at
     From jobs
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT ${filters.limit}
     OFFSET ${filters.offset}
      `;
       return result;
}