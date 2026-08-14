"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import NotificationMenu from "@/components/notifications/NotificationMenu";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER";
};

export function Navbar() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();

          if (!cancelled && data.user) {
            const currentUser: CurrentUser = {
              id: data.user.id,
              name: data.user.fullName,
              email: data.user.email,
              role: data.user.role as "CANDIDATE" | "RECRUITER",
            };

            setUser(currentUser);

            localStorage.setItem(
              "user",
              JSON.stringify(currentUser)
            );

            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }

      
      if (!cancelled) {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          try {
            const parsedUser =
              JSON.parse(storedUser) as CurrentUser;

            setUser(parsedUser);
          } catch {
            localStorage.removeItem("user");
          }
        }
      }
    }

    loadUser().finally(() => {
      if (!cancelled) {
        setMounted(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const isLoggedIn = user !== null;

  const dashboardLink =
    user?.role === "RECRUITER"
      ? "/dashboard/recruiter"
      : "/dashboard/candidate";

  if (!mounted) {
    return (
      <nav className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Hirely
          </h1>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <h1 className="cursor-pointer text-3xl font-bold tracking-tight text-primary">
            Hirely
          </h1>
        </Link>

        <div className="flex items-center gap-10">
          <Link
            href="/jobs"
            className={`transition-colors ${
              pathname === "/jobs"
                ? "font-medium text-primary"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Jobs
          </Link>

          {isLoggedIn && (
            <Link
              href={dashboardLink}
              className={`transition-colors ${
                pathname.startsWith("/dashboard")
                  ? "font-medium text-primary"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
             <NotificationMenu />
             <UserMenu user={user} />

            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-400 transition hover:text-white"
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