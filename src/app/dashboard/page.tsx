"use client";

import { useEffect, useState } from "react";

export default function DashboardPage(){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [location,setLocation] = useState("");
    const [salary,setSalary] = useState<number | "">("");
    const [skills,setSkills] = useState("");
    const [jobs, setJobs] = useState<any[]>([]);
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
                    salary:Number(salary),
                    skills:skills.split(",").map ((s)=>s.trim()),
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
            setJobs((prev)=>[...prev,data.job]);
        }catch{
            setMessage("Something went wrong");
        }finally{
            setLoading(false);
        }
    };
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
                            <p className="text-primary text-sm mt-1"> ₹  {job.salary ? job.salary.toLocalString(): "Not specified"}</p>
                            <p className="text-xs text-gray-500 mt-2">{new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
               )}
            </div>
        </div>
    )
}