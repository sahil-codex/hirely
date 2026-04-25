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
type Application = {
    id:string;
    email:string;
    status:string;
}

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
    const [applications,setApplications] = useState<Application[]>([]);
    const [selectedJob,setSelectedJob] = useState<string | null>(null);
    const [showConfirm,setShowConfirm] = useState(false);
    const [jobToDelete,setJobToDelete] = useState<string | null>(null);
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
    const handleDeleteClick = async (id:string)=>{
        setJobToDelete(id);
        setShowConfirm(true);
    };
       
        const confirmDelete = async() =>{
            if(!jobToDelete) return;
    try{
        const res = await fetch(`/api/jobs/${jobToDelete}`,{
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
        setJobs((prev)=>prev.filter((job)=>job.id!==jobToDelete));
    }catch(err:any){
        setMessage(err.message);
    } finally{
            setShowConfirm(false);
            setJobToDelete(null);
    }
    };
     
    const updateStatus = async(
        applicationId:string,status:"SHORTLISTED"|"REJECTED"
    ) => {
        try{
            const res = await fetch(`/api/jobs/${applicationId}/applications`,{
                method:"PATCH",
                credentials:"include",
                headers:{ 
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({status}),
            });
            if(!res.ok){
                alert("Failed to update");
                return;
            }
            setApplications((prev)=>prev.map((app)=>app.id===applicationId?{...app,status}:app));
        }catch{
            alert("Error updating status");
        }
    };

    const handleViewApplication = async (jobId:string) => {
        if(selectedJob === jobId){
            setSelectedJob(null);
            setApplications([]);
            return;
        }
        try{
            const res = await fetch(`/api/jobs/${jobId}/applications`,{
                credentials:"include",
            })
            const data = await res.json();
            if(!res.ok){
                alert(data.error || "Failed to load applications");
                return;
            }
            setApplications(data.applications || []);
            setSelectedJob(jobId);
        }catch{
            alert("Failed to load applications");
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
                        <div key={job.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition space-y-3">
                        <h3 className="text-white font-medium">{job.title}</h3>
                        <div className=" space-y-1 text-sm">
                         {job.description && (
                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{job.description}</p>
                         )}

                            <p className="text-gray-400 text-sm mt-2"> 📍{job.location || "Remote"}</p>
                            <p className="text-primary text-sm mt-1"> ₹  {job.salary!==null&& job.salary !==undefined ? Number(job.salary).toLocaleString(): "Not specified"}</p>
                            <p className="text-xs text-gray-500 mt-2">{new Date(job.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                 <button onClick={()=>handleDeleteClick(job.id)} className="text-xs font-medium text-red-400 hover:text-red-300 transition">DELETE</button>
                                 <button onClick={() => handleViewApplication(job.id)} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition">{selectedJob===job.id?"Hide Applications" :"View Applications"}</button>
                            </div>
                        
                        {selectedJob === job.id && (
                            <div className="mt-4 border-t border-border pt-3 space-y-2">
                            <h4 className="text-sm text-gray-300">Applications:</h4>
                            {applications.length===0 ? (
                                <p className="text-gray-500 text-sm">No applications yet</p>
                            ) :(
                                applications.map((app)=>(
                                    <div key={app.id} className="text-sm text-gray-300 border border-border rounded-lg p-2">
                                        <p>📧 {app.email}</p>
                                        <p>Status: {app.status}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={()=>updateStatus(app.id,"SHORTLISTED")} className="text-green-400 text-xs">Shortlist</button>
                                            <button onClick={()=>updateStatus(app.id,"REJECTED")} className="text-red-400 text-xs">Reject</button>
                                        </div>
                                        </div>
                                      ))
                                    )}
                              </div>
                                )}
                         </div>
                    ))}
                 </div>
                )}
             </div>
                {showConfirm && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
                  <h2 className="text-lg font-semibold text-white">Are you sure?</h2>
                  <p className="text-sm text-gray-400 mt-2">This action cannot be undone.</p>
                  <div className="flex gap-3 mt-6">
                    <button onClick={()=>setShowConfirm(false)} className=" flex-1 border border-border rounded-lg py-2 text-gray-300 hover:bg-muted">Cancel</button>
                    <button onClick={confirmDelete} className="flex-1 bg-red-500 rounded-lg py-2 text-white hover:bg-red-600 ">Delete</button>
                  </div>
                  </div>
                  </div>
                )}
            </div>
    );
}