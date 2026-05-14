"use client";
import Link from 'next/link';
import {useEffect,useState} from "react";

function isCandidateRole(role: string) {
  return role.trim().toUpperCase() === "CANDIDATE";
}

export function Navbar(){
const [role,setRole] = useState("");
const [mounted,setMounted] = useState(false);
useEffect(()=>{
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (!cancelled && data.user?.role) {
          setRole(String(data.user.role));
          return;
        }
      } catch {
        /* fall through to localStorage */
      }
      if (!cancelled) {
        setRole(localStorage.getItem("role") || "");
      }
    })().finally(() => {
      if (!cancelled) setMounted(true);
    });
    return () => {
      cancelled = true;
    };
},[]);
const dashboardLink = isCandidateRole(role) ? "/dashboard/candidate" : "/dashboard";
    if(!mounted)return (<div className="w-full py-4"><h1 className="text-xl font-semibold text-primary">Hirely</h1></div>);
    return(
        <div className="w-full flex items-center justify-between py-4">
            <Link href="/"> <h1 className="text-xl font-semibold text-primary">Hirely</h1> </Link>
            <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/jobs" className="hover:text-primary transition">Jobs</Link>
             <Link href={dashboardLink} className="hover:text-primary transition">Dashboard</Link>
             </div>
             <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-primary">Login</Link>
                <Link href="/signup" className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:opacity-90 transition">Sign Up</Link>
             </div>
        </div>
    );
}

