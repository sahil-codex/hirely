import {db} from "@/lib/drizzle";
import {users} from "@/db/schema";
import {eq} from "drizzle-orm";


export async function getUserById(userId:string){
    const result = await db
    .select({
        id:users.id,
        name:users.fullName,
        email:users.email,
        role:users.role,
    })
    .from(users)
    .where(eq(users.id,userId))
    .limit(1);

    return result[0] ?? null;

}