"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

type SaveJobButtonProps = {
  jobId: string;
};

export default function SaveJobButton({
  jobId,
}: SaveJobButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch(
          `/api/jobs/${jobId}/save`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        setSaved(data.saved);
      } catch {
        // User may simply be logged out.
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, [jobId]);

  const toggleSave = async () => {
    try {
      setUpdating(true);

      const method = saved
        ? "DELETE"
        : "POST";

      const res = await fetch(
        `/api/jobs/${jobId}/save`,
        {
          method,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to update saved job"
        );
      }

      setSaved(data.saved);
    } catch (error) {
      console.error(
        "Save job error:",
        error
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={updating}
      aria-label={
        saved ? "Unsave job" : "Save job"
      }
      title={
        saved ? "Remove from saved jobs" : "Save job"
      }
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 transition hover:bg-white/5 disabled:opacity-50"
    >
      <Bookmark
        size={18}
        fill={saved ? "currentColor" : "none"}
      />

      <span>
        {saved ? "Saved" : "Save"}
      </span>
    </button>
  );
}