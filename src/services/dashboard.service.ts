import { getRecruiterStats } from "@/repositories/dashboard.repository";

export async function getDashboardService(user:any){
    if(user.role !=="RECRUITER"){
        throw new Error("Only recruiters can access dashboard");
    }
    return await getRecruiterStats(user.userId);
}