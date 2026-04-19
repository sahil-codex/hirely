"use client";

import { useEffect, useState } from "react";
type Job = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  salary?: number | null;
  createdAt: string;
};

export default function DashboardPage(){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [location,setLocation] = useState("");
    const [salary,setSalary] = useState<number | "">("");
    const [skills,setSkills] = useState("");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading,setLoading] = useState(false);
    const [loadingJobs,setLoadingJobs] = useState(true);
    const [message,setMessage] = useState("");

    useEffect(()=>{
        const fetchMyJobs = async() =>{
            try{
                const res = await fetch("/api/jobs/my",{
                    credentials:"include",
                });
                const data = await res.json();

                if(!res.ok){
                    console.error(data.error);
                    return;
                }
                setJobs(data.jobs||[]);
            }catch(err){
                console.error(err);
            }finally{
                setLoadingJobs(false);
            }
        };
        fetchMyJobs();
    },[]);

    const handleCreateJob = async(e:any) => {
        e.preventDefault();
         if (!title.trim() || !description.trim()) {
         setMessage("Title and description are required");
         return;
        }
        setMessage("");
        setLoading(true);
        try{
            const res = await fetch("/api/jobs/create",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                credentials: "include",
                body:JSON.stringify({
                    title,
                    description,
                    location,
                    salary:salary===""?null : Number(salary),
                    skills:skills.split(",").map ((s)=>s.trim()).filter(Boolean),
                }),
            });
            const data = await res.json();
            if(!res.ok){
                setMessage(data.error||"Failed to create job");
                return;
            }
            setMessage("Job created successfully 🎉");
            setTitle("");
            setDescription("");
            setLocation("");
            setSalary("");
            setSkills("");
            setJobs((prev)=>[data.job, ...prev]);
        }catch{
            setMessage("Something went wrong");
        }finally{
            setLoading(false);
        }
    };
    const handleDelete = async (id:string)=>{
    if (!confirm("Are you sure you want to delete this job?")) return;
    try{
        const res = await fetch(`/api/jobs/${id}`,{
            method:"DELETE",
            credentials:"include",
        });
        let data = null;
        try{
            data = await res.json();

        }catch {}
        if(!res.ok){
            throw new Error(data.error || "Failed to delete");
            
        }
        setJobs((prev)=>prev.filter((job)=>job.id!==id));
    }catch(err:any){
        console.error(err.message);
        setMessage(err.message);
    }
    }
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold text-white">Recruiter Dashboard</h1>
            <form onSubmit={handleCreateJob} className="bg-card border border-border rounded-2xl space-y-4 p-6">
                {message &&(
                    <p className="text-sm text-center text-primary">{message}</p>
                )}
                <input placeholder="Job Title" className="input" value={title} onChange={(e)=>setTitle(e.target.value)} required />
                <textarea className="input" placeholder="Job Description" value={description} onChange={(e)=>setDescription(e.target.value)} required />
                <input placeholder="Location" className="input" value={location} onChange={(e)=>setLocation(e.target.value)} />
                <input placeholder="Salary" type="number" min="0" step="1" value={salary} className="input" onChange={(e)=>setSalary(e.target.value==="" ? "":Number(e.target.value))} />
                <input placeholder="Skills (comma separated)" className="input" value={skills} onChange={(e)=>setSkills(e.target.value)} />
                <button type="submit" disabled ={loading} className="w-full bg-primary py-2 rounded-xl text-white hover:opacity-90 transition">{loading ? "Creating...":"Create Job"}</button>    
            
            </form>
            <div className="space-y-6 mt-8">
                <h2 className="text-lg font-semibold text-white">My Jobs</h2>
               {loadingJobs?(
                <p className="text-gray-400">Loading jobs...</p>
               ):jobs.length===0?(
                <p className="text-gray-400">No jobs posted yet.</p>
               ):(
                <div className="grid gap-4">
                    {jobs.map((job)=>(
                        <div key={job.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition">
                        <h3 className="text-white font-medium">{job.title}</h3>
                         {job.description && (
                            <p className="text-gray-400 text-sm mt-1">{job.description}</p>
                         )}

                            <p className="text-gray-400 text-sm mt-2"> 📍{job.location || "Remote"}</p>
                            <p className="text-primary text-sm mt-1"> ₹  {job.salary!==null&& job.salary !==undefined ? Number(job.salary).toLocaleString(): "Not specified"}</p>
                            <p className="text-xs text-gray-500 mt-2">{new Date(job.createdAt).toLocaleDateString()}</p>
                                 <button onClick={()=>handleDelete(job.id)} className="text-red-400 text-xs hover:text-red-300 opacity-80">DELETE</button>
                        </div>
                        
                    ))}
                </div>
               )}
            </div>
        </div>
    )
}