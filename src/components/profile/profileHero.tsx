"use client";
import {
    Briefcase,
    GraduationCap,
    MapPin,
    Pencil
} from "lucide-react";

type ProfileHeroProps={
    fullName:string;
    headline?:string;
    location?:string;
    experience?:number;
    education?:string;
    skills?:string[];
};

export default function ProfileHero({
    fullName,
    headline,
    location,
    experience,
    education,
    skills = [],
}:ProfileHeroProps){
    return(
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/60 p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"> </div>
        <div className="flex gap-6"><div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">{fullName.charAt(0).toUpperCase()}</div>
        <h1 className="text-3xl font-bold text-white">{fullName}</h1></div>
        <p className="text-zinc-400 mt-1">
            {headline || "Add a professional headline"}
        </p>
        <div className="flex flex-wrap gap-4 mt-5 text-sm text-zinc-300">{location &&(<span className="flex items-center gap-2"><MapPin size={16}/>{location}</span>)}
               {experience!== undefined && (
                <span className="flex items-center gap-2"><Briefcase size={16}/>{experience} Years</span>
               )}
               {education && (
                <span className="flex items-center gap-2">
                    <GraduationCap size={16} />
                    {education}
                </span>
          )}
        <div className="flex flex-wrap gap-2 mt-6">{skills.slice(0,6).map((skill)=>(<span key={skill} className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300">{skill}</span>))}
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-white hover:bg-white/10 transition"><Pencil size={18}/>Edit Profile</button>
        </div>
        </section>
    );
}