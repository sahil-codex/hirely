"use client";
import {useEffect,useState} from "react";
import { useParams } from "next/navigation";


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
        if(jobId){
            fetchJob();
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
        <div>
        <h1>{job.title}</h1>
        <p>{job.description}</p>
        {job.location && (
            <p><strong>Location:</strong> {job.location}</p>
        )}
        {job .salary&&(
            <p><strong>Salary:</strong> ${job.salary}</p>
        )}
        {job.skills && job.skills.length>0 &&(
            <div><strong>Skills:</strong>
            <ul>
                {job.skills.map((skill,index)=>(
                    <li key = {index}>{skill}</li>
                ))}
                </ul>
                </div>
        )}
        <button onClick={handleApply}>
            Apply Now
        </button>
        </div>
    );
}

