"use client";

import { Pencil, User } from "lucide-react";

type AboutCardProps = {
  bio?: string;
  onEdit?: () => void;
};

export default function AboutCard({
  bio,
  onEdit,
}: AboutCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all hover:border-indigo-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="text-indigo-400" size={20} />
          <h2 className="text-lg font-semibold text-white">About Me</h2>
        </div>

        <button
          onClick={onEdit}
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <Pencil size={18} />
        </button>
      </div>

      <div className="mt-5">
        {bio ? (
          <p className="leading-7 text-zinc-300">{bio}</p>
        ) : (
          <p className="italic text-zinc-500">
            Tell recruiters about yourself.
          </p>
        )}
      </div>
    </section>
  );
}