"use client";

import { useEffect, useState } from "react";

export default function DashboardPage(){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [location,setLocation] = useState("");
    const [salary,setSalary] = useState("");
    const [skills,setSkills] = useState("");
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading,setLoading] = useState(false);
    const [loadingJobs,setLoadingJobs] = useState(true);
    const [message,setMessage] = useState("");

    useEffect(()=>{
        const fetchMyJobs = async() =>{
            try{
                const res = await fetch("/api/jobs/my");
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
                <input placeholder="Salary" type="number" min="0" step="1" value={salary} className="input" onChange={(e)=>setSalary(e.target.value)} />
                <input placeholder="Skills (comma seperated)" className="input" value={skills} onChange={(e)=>setSkills(e.target.value)} />
                <button type="submit" disabled ={loading} className="w-full bg-primary py-2 rounded-xl text-white hover:opacity-90 transition">{loading ? "Creating...":"Create Job"}</button>    
            
            </form>
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4 text-white">My Jobs</h2>
               {loadingJobs?(
                <p className="text-sm text-muted-foreground">Loading jobs...</p>
               ):jobs.length===0?(
                <p className="text-sm text-muted-foreground">No jobs posted yet.</p>
               ):(
                <ul className="space-y-3">
                    {jobs.map((job,i)=>(
                        <li key={i} className="p-3 border rounded-lg">
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm">{job.description}</p>
                            <p className="text-xs text-muted-foreground">{job.location} • ₹{job.salary}</p>
                        </li>
                    ))}
                </ul>
               )}
            </div>
        </div>
    )
}