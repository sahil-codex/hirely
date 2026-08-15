"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  FileText,
  LayoutDashboard,
  LogOut,
  Bookmark,
} from "lucide-react";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role?: "CANDIDATE" | "RECRUITER";
};

type UserMenuProps = {
  user: CurrentUser | null;
};

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  const initial = useMemo(
    () => user?.name?.charAt(0).toUpperCase() ?? "",
    [user]
  );

  const menuItems = useMemo(() => {
    if (!user) return [];

    const items: {
      href: string;
      label: string;
      icon: typeof User;
    }[] = [
      {
        href: "/profile",
        label: "My Profile",
        icon: User,
      },
    ];

    if (user.role?.toUpperCase() === "CANDIDATE") {
      items.push({
        href: "/dashboard/candidate",
        label: "My Applications",
        icon: FileText,
      });
    }

    if (user.role?.toUpperCase() === "RECRUITER") {
      items.push({
        href: "/dashboard/recruiter",
        label: "Recruiter Dashboard",
        icon: LayoutDashboard,
      });
    }

    return items;
  }, [user]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("theme");

      window.dispatchEvent(new Event("authChanged"));

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  if (!user) return null;

  const itemClass =
    "flex items-center gap-3 rounded-lg px-4 py-2 transition hover:bg-zinc-800 focus:bg-zinc-800 focus:outline-none";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="User menu"
        className="flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-zinc-800"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white shadow-lg">
          {initial}
        </div>

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        role="menu"
        aria-hidden={!open}
        className={`absolute right-0 z-50 mt-3 w-72 origin-top-right rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl transition-all duration-200 ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="border-b border-zinc-800 px-4 py-3">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-lg">
            {initial}
          </div>

          <p className="font-semibold text-white">
            {user.name}
          </p>

          <p className="truncate text-sm text-zinc-400">
            {user.email}
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              user.role?.toUpperCase() === "RECRUITER"
                ? "bg-violet-500/10 text-violet-400"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {user.role?.toUpperCase() === "RECRUITER"
              ? "Recruiter"
              : "Candidate"}
          </span>
        </div>

        <div className="flex flex-col gap-1 py-2">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}

          {/* Saved Jobs */}
          {user.role?.toUpperCase() === "CANDIDATE" && (
            <Link
              href="/saved-jobs"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              <Bookmark size={18} />
              <span>Saved Jobs</span>
            </Link>
          )}

          <div className="my-2 border-t border-zinc-800" />

          <button
            type="button"
            role="menuitem"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={18} />

            <span>
              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}