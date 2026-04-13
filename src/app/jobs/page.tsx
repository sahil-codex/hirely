"use client";

import { useEffect,useState } from "react";

export default function JobsPage(){
    const [jobs,setJobs] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    useEffect(()=>{
     const fetchJobs = async ()=> {
        try {
            setError("");
            const res = await fetch("/api/jobs/search");
          
        if(!res.ok){
            throw new Error("Failed to fetch jobs");
        }const data = await res.json();
       setJobs(Array.isArray(data.jobs) ? data.jobs : data.jobs?.jobs || []);
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

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-white">Available Jobs</h1>
              {error && ( <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-3 text-sm">{error}</p>)}
                {jobs.length === 0 && !error &&(
                    <p className="text-gray-400">No jobs found</p>
                )}
                <div className="grid gap-4">
                {jobs.map((job:any)=>(
                    <div key={job.id}
                    className="bg-card border border-border rounded-xl p-5">
                        <h2 className="text-lg text-white font-medium">{job.title}</h2>
                        <p className="text-gray-400 text-sm mt-1">{job.location||"Remote"}</p>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-primary font-semibold">
                                  ₹{job.salary||"Not disclosed"}
                                </span>
                        <button className="bg-primary px-4 py-1 rounded-lg text-sm" >Apply</button>
                        </div>
                        </div>    
                ))}
        </div>
        </div>
    );
}