"use client";

import { useState } from "react";

export function DashboardPage(){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [location,setLocation] = useState("");
    const [salary,setSalary] = useState("");
    const [skills,setSkills] = useState("");
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState("");

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
                <input placeholder="Salary" type="number" onChange={(e)=>setSalary(e.target.value)} />
                <input placeholder="Skills (comma seperated)" className="input" value={skills} onChange={(e)=>setSkills(e.target.value)} />
                <button type="submit" disabled ={loading} className="w-full bg-primary py-2 rounded-xl text-white hover:opacity-90 transition">{loading ? "Creating...":"Create Job"}</button>    
            
            </form>
        </div>
    )
}