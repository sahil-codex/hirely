"use client";

import { useEffect,useState } from "react";
import ProfileHero from "@/components/profile/profileHero";
import ProfileProgress from "@/components/profile/ProfleProgress";

type Profile = {
    fullName: string;
    headline?:string;
    bio?:string;
    location?:string;
    experience?:number;
    education?:string;
    company?:string;
    skills?:string[];
    githubUrl?:string;
    linkedinUrl?:string;
    portfolioUrl?:string;
    resumeUrl?:string;
};

export default function ProfilePage(){

    const [profile,setProfile] = 
    useState<Profile>({
        fullName:"",
        headline:"",
        bio:"",
        location:"",
        experience:0,
        education:"",
        company:"",
        skills:[],
        githubUrl:"",
        linkedinUrl:"",
        portfolioUrl:"",
        resumeUrl:"",
    });

    const [loading,setLoading] = useState(true);
    const [saving,setSaving]  = useState(false);
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    useEffect(()=>{
        const fetchProfile = async()=>{
            try{
                const res = await fetch("/api/profile",{
                    credentials:"include",
                });
                if(!res.ok){
                    throw new Error("Failed to load profile");
                }
                const data = await res.json();
                if(data.profile){
                    setProfile((prev)=> ({
                        ...prev,
                        ...data.profile,
                    }));
                }
            }catch(err){
                if(err instanceof Error){
                setError(err.message);
                }else {
                    setError("Something went wrong.");
                }
            }finally{
                setLoading(false);
            }
        };
        fetchProfile();
    },[]);

    const handleSave = async() => {
        try{
            setSaving(true);
            setError("");
            setSuccess("");

            const res = await fetch("/api/profile",{
                method:"PATCH",
                headers: {
                    "Content-Type":"application/json",
                },
                credentials:"include",
                body:JSON.stringify(profile),
            });
            const data = await res.json();

            if(!res.ok){
                throw new Error(
                    data.error|| "Failed to save"
                );
            }
            setSuccess("Profile updated successfully!");
        }catch(err){
            if(err instanceof Error){
            setError(err.message);
            }else {
                setError("Something went wrong.");
            }
        }finally{
            setSaving(false);
        }
    };

    if(loading){
        return(
            <p className="text-white">Loading profile...</p>
        );
    }
    return(
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white">Profile</h1>
                <p className="text-zinc-400 mt-2">Manage your professional profile</p>
            </div>
            <ProfileHero
                fullName={profile.fullName}
                headline={profile.headline}
                location={profile.location}
                experience={profile.experience}
                education={profile.education}
                skills={profile.skills}
                />

                <div className="mt-6">
                <ProfileProgress profile={profile} />
                </div>
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
                    {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl" >
                        {success}
                        </div>
                )}
                <input value={profile.fullName}
                     onChange={(e)=>setProfile({...profile,fullName:e.target.value,})}
                     placeholder="Full Name"
                     className="w-full bg-transparent border border-border rounded-xl px-4 py-3"/>
                     <textarea value={profile.bio ?? ""}
                     onChange={(e)=>setProfile({...profile,bio:e.target.value,})}
                     placeholder="Bio"
                     rows={5}
                     className="w-full bg-transparent border border-border rounded-xl px-4 py-3"/>
                     
                     <input type="number"
                     value={profile.experience ??0}
                     onChange={(e)=> setProfile({...profile,experience:Number(e.target.value),})}
                     placeholder="Years of Experience"
                     className="w-full bg-transparent border border-border rounded-xl px-4 py-3"/>
                    
                     <input value={profile.skills?.join(", ") ?? ""}
                     onChange={(e)=> setProfile({
                        ...profile,skills:e.target.value
                                  .split(",")
                                  .map((s)=>s.trim())
                                  .filter(Boolean),

                     })}
                     placeholder="Skills (comma separated)"
                     className="w-full bg-transparent border border-border rounded-xl px-4 py-3"/>

                     <input 
                        value = {profile.githubUrl ?? ""}
                         onChange={(e)=>
                             setProfile({
                                ...profile,
                                   githubUrl:e.target.value,
                             })
                         }
                         placeholder="GitHub URL"
                         className="w-full bg-transparent border border-border rounded-xl px-4 py-3"/>

                         <input 
                          value={profile.linkedinUrl ?? ""}
                          onChange={(e)=>
                             setProfile({
                                ...profile,
                                linkedinUrl:e.target.value,
                             })
                          } 
                          placeholder="LinkedIn URL"
                          className="w-full bg-transparent border border-border rounded-xl px-4 py-3"/>

                           <input 
                          value={profile.portfolioUrl ?? ""}
                          onChange={(e)=>
                             setProfile({
                                ...profile,
                                portfolioUrl:e.target.value,
                             })
                          } 
                          placeholder="Portfolio URL"
                          className="w-full bg-transparent border border-border rounded-xl px-4 py-3"/>

                         <button
                           onClick = {handleSave}
                           disabled = {saving}
                           className="bg-primary px-6 py-4 rounded-xl text-white hover:opacity-90 disabled:opacity-50">
                           {saving
                             ? "Saving..."
                             : "Save Profile"}
                             </button>

                    
            </div>
        </div>
    );
}