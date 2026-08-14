"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

type SavedJob = {
  savedJobId: string;
  jobId: string;
  title: string;
  description: string;
  location: string | null;
  salary: number | null;
  skills: string[] | null;
  savedAt: string;
};

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSavedJobs() {
      try {
        const res = await fetch(
          "/api/saved-jobs",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ||
              "Failed to load saved jobs"
          );
        }

        setJobs(data.jobs ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-zinc-400">
          Loading saved jobs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Bookmark size={26} />

          <h1 className="text-3xl font-bold">
            Saved Jobs
          </h1>
        </div>

        <p className="mt-2 text-zinc-400">
          Jobs you've saved for later.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Bookmark
            className="mx-auto mb-3 text-zinc-500"
            size={32}
          />

          <h2 className="text-lg font-semibold">
            No saved jobs
          </h2>

          <p className="mt-1 text-zinc-400">
            Save jobs you're interested in
            and come back to them later.
          </p>

          <Link
            href="/jobs"
            className="mt-5 inline-block rounded-lg bg-primary px-5 py-2 text-white"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.savedJobId}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {job.title}
                  </h2>

                  {job.location && (
                    <p className="mt-1 text-sm text-zinc-400">
                      {job.location}
                    </p>
                  )}

                  {job.salary !== null && (
                    <p className="mt-2 text-sm">
                      Salary: {job.salary}
                    </p>
                  )}
                </div>

                <Link
                  href={`/jobs/${job.jobId}`}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                  View Job
                </Link>
              </div>

              {job.skills &&
                job.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border px-3 py-1 text-sm text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}