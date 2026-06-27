"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";

function isCandidateRole(role: string) {
  return role.trim().toUpperCase() === "CANDIDATE";
}

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const [user,setUser] = useState({
    name:"",role:"",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (!cancelled && data.user) {
          setUser({
             name:data.user.fullName ?? "",
             role:data.user.role??"",
          });
          setIsLoggedIn(true);
          return;
        }
      } catch {
  
      }
      if (!cancelled ) {
        const storedRole = localStorage.getItem("role") || "";
        const storedName = localStorage.getItem("fullName") || "";

        setUser({name:storedName,role:storedRole,});
        setIsLoggedIn(!!storedRole);
      }
    })().finally(() => {
      if (!cancelled) setMounted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const dashboardLink = isCandidateRole(user.role)
    ? "/dashboard/candidate"
    : "/dashboard/recruiter";

  if (!mounted) {
    return (
      <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <h1 className="cursor-pointer text-3xl font-bold tracking-tight text-primary">Hirely</h1>
      </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
      <Link href="/">
        <h1 className="cursor-pointer text-3xl font-bold tracking-tight text-primary">Hirely</h1>
      </Link>
      <div className="flex items-center gap-10">
        <Link href="/jobs" className={`transition-colors ${ pathname === "/jobs" ? "text-primary font-medium" : "text-zinc-400 hover:text-white"}`}>
          Jobs
        </Link>
        {isLoggedIn && (
            <Link href={dashboardLink} className={`transition-colors ${ pathname.startsWith("/dashboard") ? "text-primary font-medium": "text-zinc-400 hover:text-white"}`} >
            Dashboard
          </Link>
        )}
        </div>
        <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
          <button type = "button" className="flex h-10 w-10 rounded-full items-center justify-center hover:bg-zinc-800 transition"><Bell size={18}/></button>
          <UserMenu/>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className=" text-zinc-400 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-500"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
      </div>
    </nav>
  );
}
