"use client";

import { useEffect,useState } from "react";
import {User} from "lucide-react";
import Link from "next/link";

export default function UserMenu(){
    const [open,setOpen] = useState(false);
    const [role,setRole] = useState("");

    useEffect(()=> {
        const storedRole = localStorage.getItem("role");

        if(storedRole){
            setRole(storedRole);
        }
    },[]);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/login";
    };

    return (
        <div className="relative">
            <button onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition"><User size={20} /></button>
            {open &&(
                <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-2 z-50">
                    {role ==="CANDIDATE" && (
                        <>
                        <Link href= "/dashboard/candidate"
                        className="block px-4 py-2 rounded-lg hover:bg-zinc-800">My Applications </Link>
                        <Link href="/profile" className="block px-4 py-2 rounded-lg hover:bg-zinc-800">Profile</Link>
                        </>
                    )}

                    {role === "RECRUITER" &&(
                        <>
                        <Link href = "/dashboard/recruiter" className="block px-4 py-2 rounded-lg hover:bg-zinc-800">Recruiter Dashboard</Link>
                        <Link href= "/profile"className="block px-4 py-2 rounded-lg hover:bg-zinc-800">Profile</Link>
                        </>
                    )}

                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400">Logout</button>
                    </div>
            )}
        </div>
    );
}