"use client";
import { useEffect,useState } from "react";

type Application = {
    id:string;
    status:string;
    createdAt:string;
    title:string;
    location?:string;
    salary?:number;
};

export default function CandidateDashboardPage(){
    const [applications,setApplications] = useState<Application[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");

    useEffect(()=>{
        const fetchApplications = async()=>{
            try{
                const res = await fetch("/api/applications/me",{
                    credentials:"include",
                });
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.error || "Failed to load");
                }
                setApplications(data.applications || []);
            }catch(err:any){
                setError(err.message || "Failed to load appliations");
            }finally{
                setLoading(false);
            }
        };
        fetchApplications();
    },[]);
    return(
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Applications</h1>
         {loading ? (
            <p className="text-gray-400">Loading applications...</p>
         ):error?(
            <p className="text-red-400 border border-red-500/20 bg-red-500/10 rouned-lg px-4 py-2">{error}</p>
         ):applications.length===0?(
            <p className="text-gray-400">No applications yet.</p>
         ): applications.length===0?(
            <p className="text-gray-400">No applications yet.</p>
        ):(
                <div className=" grid gap-4">
                    {applications.map((app)=>(
                        <div key={app.id}className="border border-border rounded-2xl bg-card p-6">
                            <h2 className="text-xl text-white font-semibold">{app.title}</h2>
                            <p className="text-gray-400 mt-1">{app.location||"Remote"}</p>
                            <p className="text-primary font-semibold mt-2">{app.salary ?`₹${app.salary}`: "Salary not disclosed"}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-gray-400"> Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                <span className="text-sm px-3 py-1 rounded-full border border-border text-white">{app.status} </span>
                            </div>
                        </div>    
                    ))}
                </div>    
         )}
        </div>
    );
}