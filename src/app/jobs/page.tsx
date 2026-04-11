"use client";

import { useEffect,useState } from "react";

export default function JobsPage(){
    const [job,setJobs] = useState([]);

    useEffect(()=>{
        fetch("/api/jobs/search")
        .then((res)=> res.json())
        .then((data)=>setJobs(data.jobs||[]));
    },[]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-white">Available Jobs</h1>
            <div className="grid gap-4">
                {job.map((job:any)=>(
                    <div key={job.id}
                    className="bg-card border border-border rounded-2xl p-5">
                        <h2 className="text-lg text-white font-medium">{job.title}</h2>
                        <p className="text-gray-400 text-sm mt-1">{job.location||"Remote"}</p>

                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-primary font-semibold">
                                ₹{job.salary||"Not specified"}
                            </span>
                            <button className="bg-primary px-4 py-1 rounded-lg text-sm">Apply</button>
                            </div>
                        </div>    
                ))}
            </div>
        </div>
    )
}