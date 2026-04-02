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

    const whereClause =
  conditions.length > 0
    ? sql`WHERE ${conditions.slice(1).reduce(
        (acc, curr) => sql`${acc} AND ${curr}`,
        conditions[0]
      )}`
    : sql``;
    
      const jobsPromise = sql`
     SELECT id,title,location,salary,created_at
     From jobs
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT ${filters.limit}
     OFFSET ${filters.offset}
      `;
      const countPromise = sql`
       SELECT COUNT(*) FROM jobs
       ${whereClause}`;

      const [jobs,countResult] = await Promise.all([
        jobsPromise,
        countPromise,
      ]);
      const totalCount = Number(countResult[0].count);
       return  {jobs,totalCount};
}