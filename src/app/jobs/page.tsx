"use client";

import { useEffect,useState } from "react";
import Link from "next/link";
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
    const [role,setRole] = useState("");
    const [keyword,setKeyword] = useState("");
    const [location,setLocation] = useState("");
    const [minSalary,setMinSalary] = useState("");
    const [skills,setSkills] = useState("");
    const [debouncedKeyword,setDebouncedKeyword] = useState("");
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setDebouncedKeyword(keyword);
        },400);
        return ()=>clearTimeout(timer);
    },[keyword]);
    useEffect(()=>{
         const storedRole = localStorage.getItem("role");
        if(storedRole){
        setRole(storedRole);
     }
    },[]);
    useEffect(()=>{
     const fetchJobs = async ()=> {
        try {
            setLoading(true);
            setError("");
             if(!debouncedKeyword.trim() && !location.trim()&& !minSalary.trim()&& !skills.trim()
             ){
         setJobs([]);
         setLoading(false);
        return;
         }
            const params = new URLSearchParams();

            if(debouncedKeyword.trim()){
                params.append("keyword",debouncedKeyword);
            }
            if(location.trim()){
                params.append("location",location);
            }
            if(minSalary.trim()){
                params.append("minSalary",minSalary);
            }
            if(skills.trim()){
                params.append("skills",skills);
            }
            const res = await fetch(`/api/jobs/search?${params.toString()}`,{
                method:"GET",
                credentials:"include",
            });
          
        if(!res.ok){
            throw new Error("Failed to fetch jobs");
        }const result = await res.json();
         const jobsData = Array.isArray(result.jobs) ? result.jobs : result.jobs?.jobs || [];
       setJobs(jobsData as Job[]);
    }catch(err){
        console.error(err);
        setError("Could not load jobs");
    }finally{
        setLoading(false);
      }
    };
     fetchJobs();
  },[debouncedKeyword,location,minSalary,skills]);
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
            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <input type = "text" placeholder="Search jobs..." value={keyword} onChange={(e)=>setKeyword(e.target.value)} className="input"/>
                <input type = "text" placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} className="input"/>
                <input type = "number" placeholder= "Min Salary" value={minSalary} onChange={(e)=>setMinSalary(e.target.value)} className="input"/>
                <input type = "text" placeholder="Skills (React,Node)" value={skills} onChange={(e)=>setSkills(e.target.value)} className="input"/>
            </div>
              {error && ( <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-3 text-sm">{error}</p>)}
               {loading && (
                <div className="text-gray-400 animate-pulse">
                <p className="text-white">Loading jobs...</p>
                </div>
               )}
                {jobs.length === 0 && !error && !loading &&(
                    <p className="text-gray-400">No jobs found</p>
                )}
                {keyword && (
                    <p className="text-sm text-gray-400"> Showing results for:{" "}
                    <span className="text-white">{keyword}</span>
                    </p>
                )}
                <div className="grid gap-4">
                {jobs.map((job)=>(
                    <div key={job.id}
                    className="bg-card border border-border rounded-xl p-5">
                        <h2 className="text-lg text-white font-medium">{job.title}</h2>
                        <p className="text-gray-400 text-sm mt-1">{job.location||"Remote"}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-primary font-semibold">
                                  {job.salary ?`₹${job.salary.toLocaleString("en-IN")}`:"Not disclosed"}
                                </span>
                                <div className="flex items-center gap-3">
                         {role === "CANDIDATE"?(
                        <button onClick= {()=>handleApply(job.id)} className="bg-primary px-4 py-1 rounded-lg text-sm" >Apply</button>
                         ):(
                            <button disabled className="px-4 py-1 rounded-lg text-sm border border-border text-gray-500 cursor-not-allowed">Recruiters cannot apply</button>
                         )}
                        <Link href={`/jobs/${job.id}`} className = "text-blue-400 text-sm hover:text-blue-300">View Details</Link>
                        </div>
                        </div> 
                        </div>   
                ))}
        </div>
        </div>
    );
}