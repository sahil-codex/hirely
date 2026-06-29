
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  User,
  FileText,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER";
};

export default function UserMenu() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const itemClass =
    "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-800 transition";

  useEffect(() => {
    async function loadUser() {

      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        console.log(data);
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.clear();

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full hover:bg-zinc-800 px-2 py-1 transition"
      >
        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-white">
          {user.name.charAt(0).toUpperCase() ?? "U"}
        </div>

        <ChevronDown
          size={16}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl p-2 z-50">
        
          <div className="px-4 py-3 border-b border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg text-white mb-3">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <p className="font-semibold text-white">
              {user.name ?? "User"}
            </p>

            <p className="text-sm text-zinc-400 truncate">
              {user.email}
            </p>

            <p className="text-xs text-blue-400 mt-1">
              {user.role}
            </p>
          </div>

          
          <div className="py-2 flex flex-col gap-1">
            <Link href="/profile" className={itemClass}>
              <User size={18} />
              <span>My Profile</span>
            </Link>

            {user.role === "CANDIDATE" && (
              <Link
                href="/dashboard/candidate"
                className={itemClass}
              >
                <FileText size={18} />
                <span>My Applications</span>
              </Link>
            )}

            {user.role === "RECRUITER" && (
              <Link
                href="/dashboard/recruiter"
                className={itemClass}
              >
                <LayoutDashboard size={18} />
                <span>Recruiter Dashboard</span>
              </Link>
            )}

            <div className="border-t border-zinc-800 my-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}