"use client";

import { useEffect,useState } from "react";

type Job = {
  id: string;
  title: string;
  location?: string;
  salary?: number;
};
export default function JobsPage(){
    const [jobs,setJobs] = useState<Job[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    useEffect(()=>{
     const fetchJobs = async ()=> {
        try {
            setError("");
            const res = await fetch("/api/jobs/search",{
                method:"GET",
                credentials:"include",
            });
          
        if(!res.ok){
            throw new Error("Failed to fetch jobs");
        }const result = await res.json();
         const jobsData = Array.isArray(result.jobs) ? result.jobs : result.jobs?.jobs || [];
       setJobs(jobsData as Job[]);
    }catch(err){
        setError("Could not load jobs");
    }finally{
        setLoading(false);
      }
    };
     fetchJobs();
  },[]);
    if(loading){
        return <p className="text-white">Loading jobs...</p>;
    }
   const handleApply = async(jobId:string) => {
    try{
        const res = await fetch("/api/jobs/apply",{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
            },body:JSON.stringify({jobId}),
        });
        const data = await res.json();
        if(!res.ok){
            alert(data.error||"Failed to apply");
            return;
        }
        alert("Applied successfully 🎉");
    }catch(err){
        alert("Something went wrong");
    }
   };
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-white">Available Jobs</h1>
              {error && ( <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-3 text-sm">{error}</p>)}
                {jobs.length === 0 && !error &&(
                    <p className="text-gray-400">No jobs found</p>
                )}
                <div className="grid gap-4">
                {jobs.map((job)=>(
                    <div key={job.id}
                    className="bg-card border border-border rounded-xl p-5">
                        <h2 className="text-lg text-white font-medium">{job.title}</h2>
                        <p className="text-gray-400 text-sm mt-1">{job.location||"Remote"}</p>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-primary font-semibold">
                                  ₹{job.salary||"Not disclosed"}
                                </span>
                        <button onClick= {()=>handleApply(job.id)} className="bg-primary px-4 py-1 rounded-lg text-sm" >Apply</button>
                        </div>
                        </div>    
                ))}
        </div>
        </div>
    );
}