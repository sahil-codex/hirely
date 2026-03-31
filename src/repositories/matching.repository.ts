import { sql } from "@/lib/db";

export async function getJobById(jobId:string) {
    const result = await sql`
    SELECT * FROM jobs WHERE id =${jobId}`;
    return result[0];
}

export async function getAllCandidates(){
    const result = await sql`
    SELECT p.*,u.id as user_id
    FROM profiles p
    JOIN users u ON p.user_id = u.id
    WHERE u.role = 'CANDIDATE'`;
    return result;
}