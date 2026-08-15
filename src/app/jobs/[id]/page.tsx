"use client";
import {useEffect,useState} from "react";
import { useParams } from "next/navigation";
import SaveJobButton from "@/components/jobs/SaveJobButton";

type Job = {
    id:string;
    title:string;
    description:string;
    location?:string;
    salary?:number;
    skills?:string[];
};

export default function JobDetailsPage(){
    const params = useParams();
    const jobId = params.id as string;
    const [job,setJob] = useState<Job | null>(null);
    const [loading,setLoading] = useState(true);
    const[error,setError] = useState("");
    const [role,setRole] = useState("");
    useEffect(()=>{
        const fetchJob = async () =>{
            try{
                const res = await fetch(`/api/jobs/${jobId}`);
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error || "Failed to load job");
                }
                setJob(data.job);
            }catch(err:any){
                setError(err.message || "Something went wrong");
            }finally{
                setLoading(false);
            }
        };

         const fetchMe = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setRole(data.user.role);
      }
    } catch (err) {
      console.log(err);
    }
  };
        if(jobId){
            fetchJob();
            fetchMe();
        }
    },[jobId]);
    const handleApply = async () => {
        try{
            const res = await fetch("/api/jobs/apply",{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({jobId}),
            });
            const data = await res.json();
             if (!res.ok) {
              alert(data.error || "Failed to apply");
              return;
             }

      alert("Applied successfully 🎉");

      } catch {
       alert("Something went wrong");
         }
    };
    if(loading){
        return <p className="text-white">Loading...</p>;
    }
    if(error){
        return <p>{error}</p>;
    }
    if(!job){
        return <p>Job not found</p>;
    }
    return(
        <div className="max-w-4xl mx-auto px-6 py-10">
         <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
         <div className="flex flex-col gap-3">       
        <h1 className="text-4xl font-bold text-white">{job.title}</h1>
        <p className="text-gray-400 text-lg">{job.location || "Remote"}</p>
        <p className="text-2xl font-semibold text-primary">{job.salary ?`₹${job.salary.toLocaleString("en-IN")}` : "Not disclosed"}</p>
        </div>
        <div className="mt-8 border-t border-border pt-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Job Description</h2>
            <p> {job.description}</p>
            </div>
        {job.skills && job.skills.length>0 &&(
            <div className="mt-8 border-t border-border pt-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-3">
        {job.skills.map((skill,index)=>(
            <span key = {index} className="px-4 py-2 rounded-full border border-border bg-white/5 text-gray-300 text-sm">{skill}</span>
                ))}
                </div>
                </div>
        )}
        <div className="mt-10 flex justify-end">
             {role?.toUpperCase() === "CANDIDATE" ? (
      <button
       onClick={handleApply}
       className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition duration-200"
     >
       Apply Now
     </button>
   ) : role ? ( 
       <button disabled className="px-6 py-3 rounded-xl font-medium border border-border text-gray-500 cursor-not-allowed"> Recruiters cannot apply</button>
            ) : null}
        </div>
        </div>
        </div>
    );
}
