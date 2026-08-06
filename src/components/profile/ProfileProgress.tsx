"use client";
type ProfileProgressProps = {
    profile:{
        fullName?:string|null;
        headline?:string|null;
        bio?:string|null;
        location?:string|null;
        experience?:number|null;
        education?:string|null;
        company?:string|null;
        skills?:string[]|null;
        resumeUrl?:string|null;
    };
};

export default function ProfileProgress({
    profile,}:ProfileProgressProps){
        const fields = [
            !!profile.fullName,
            !!profile.headline,
            !!profile.bio,
            !!profile.location,
            profile.experience!==null && profile.experience !==undefined,
            !!profile.education,
            !!profile.company,
            (profile.skills?.length??0)>0,
            !!profile.resumeUrl,
            ];

        const completed = fields.filter(Boolean).length;
        const total = fields.length;
        
        const percentage = Math.round(
            (completed/total) *100
        );

        return(
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6">
                
                <div className="flex items-center justify-between mb-3">
                 <div>   
                <h3 className="font-semibold text-white">Profile Completion</h3>
                <p className="text-sm text-zinc-400 mt-1">Complete your profile to improve your visibility.</p></div>
                <span className="text-lg font-bold text-indigo-400">{percentage}%</span></div>
                    <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
                        <div style={{width:`${percentage}%`,}}className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"/>
                        </div>
                        <p className="mt-3 text-sm text-zinc-500">{completed} of {total} sections completed</p>
                        </div>
        );
}