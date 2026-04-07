import{
    getJobById,
    getAllCandidates,
} from "@/repositories/matching.repository";

export async function matchCandidatesService(jobId:string) {
    const job = await getJobById(jobId);
    if(!job){
        throw new Error("Job not found");
    }
    const candidates = await getAllCandidates();
    const results = candidates.map((candidate)=>{
        const candidateSkills = candidate.skills || [];
        const jobSkills = job.skills || [];

        const matchedSkills = candidateSkills.filter((skill:string)=>jobSkills.includes(skill)
    );
    const score = matchedSkills.length*2 + (candidate.experience || 0);
    return {
        candidateId:candidate.userId,
        name:candidate.name,
        matchedSkills,
        score,
      };
    });
    results.sort((a,b)=>b.score -a.score);
    return results;
}    