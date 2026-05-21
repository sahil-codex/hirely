"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  location?: string;
  salary?: number;
};

type SearchFilters = {
  keyword: string;
  location: string;
  minSalary: string;
  skills: string;
};

const emptyFilters: SearchFilters = {
  keyword: "",
  location: "",
  minSalary: "",
  skills: "",
};

function isCandidateRole(role: string) {
  return role.trim().toUpperCase() === "CANDIDATE";
}

function minSalaryDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatMinSalaryInput(value: string) {
  const digits = minSalaryDigits(value);
  if (!digits) return "";
  return Number(digits).toLocaleString("en-IN");
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);

  useEffect(() => {
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
        
      }
      if (!cancelled) {
        setRole(localStorage.getItem("role") || "");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = useCallback(async (search: SearchFilters) => {
    const hasAnyFilter =
      search.keyword.trim() ||
      search.location.trim() ||
      search.minSalary.trim() ||
      search.skills.trim();

    if (!hasAnyFilter) {
      setJobs([]);
      setHasSearched(false);
      setActiveFilters(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    setActiveFilters(search);

    try {
      const params = new URLSearchParams();
      if (search.keyword.trim()) params.append("keyword", search.keyword.trim());
      if (search.location.trim()) params.append("location", search.location.trim());
      const salaryDigits = minSalaryDigits(search.minSalary);
      if (salaryDigits) params.append("minSalary", salaryDigits);
      if (search.skills.trim()) params.append("skills", search.skills.trim());

      const res = await fetch(`/api/jobs/search?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Failed to fetch jobs"
        );
      }

      const result = await res.json();
      const jobsData = Array.isArray(result.jobs)
        ? result.jobs
        : result.jobs?.jobs || [];
      setJobs(jobsData as Job[]);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setError(
        err instanceof Error ? err.message : "Could not load jobs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    runSearch(filters);
  };

  const handleClear = () => {
    setFilters(emptyFilters);
    setJobs([]);
    setHasSearched(false);
    setActiveFilters(null);
    setError("");
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = async (jobId: string) => {
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to apply");
        return;
      }
      alert("Applied successfully");
    } catch {
      alert("Something went wrong");
    }
  };

  const activeSummary = activeFilters
    ? [
        activeFilters.keyword.trim() && `“${activeFilters.keyword.trim()}”`,
        activeFilters.location.trim() &&
          `in ${activeFilters.location.trim()}`,
        activeFilters.minSalary.trim() &&
          `₹${Number(minSalaryDigits(activeFilters.minSalary)).toLocaleString("en-IN")}+`,
        activeFilters.skills.trim() &&
          `skills: ${activeFilters.skills.trim()}`,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Find your next role
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Search by job title, location, minimum salary, or skills — then hit
          Search when you are ready.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-card border border-border rounded-2xl p-6 shadow-lg shadow-black/20"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Job title
            </span>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              value={filters.keyword}
              onChange={(e) => updateFilter("keyword", e.target.value)}
              className="input"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Location
            </span>
            <input
              type="text"
              placeholder="e.g. Bangalore, Remote"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="input"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Min salary (₹)
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 5,00,000"
              value={filters.minSalary}
              onChange={(e) =>
                updateFilter("minSalary", formatMinSalaryInput(e.target.value))
              }
              className="input"
            />
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Skills
            </span>
            <input
              type="text"
              placeholder="Comma-separated, e.g. React, Node"
              value={filters.skills}
              onChange={(e) => updateFilter("skills", e.target.value)}
              className="input"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching…" : "Search jobs"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm text-gray-300 border border-border hover:bg-white/5 transition disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl py-3 px-4 text-sm">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-12 text-gray-400">
          <div
            className="w-8 h-8 border-2 border-gray-700 border-t-primary rounded-full animate-spin"
            aria-hidden
          />
          <p className="text-sm">Searching jobs…</p>
        </div>
      )}

      {!loading && hasSearched && activeSummary && (
        <p className="text-sm text-gray-400">
          Results for{" "}
          <span className="text-white font-medium">{activeSummary}</span>
          {jobs.length > 0 && (
            <span className="text-gray-500">
              {" "}
              · {jobs.length} job{jobs.length === 1 ? "" : "s"}
            </span>
          )}
        </p>
      )}

      {!loading && hasSearched && jobs.length === 0 && !error && (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/50">
          <p className="text-white font-medium">No jobs match your search</p>
          <p className="text-gray-500 text-sm mt-2">
            Try different keywords, a broader location, or fewer skill filters.
          </p>
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card/50">
          <p className="text-gray-300 font-medium">Ready to explore?</p>
          <p className="text-gray-500 text-sm mt-2">
            Fill in one or more filters above, then click Search jobs.
          </p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl text-white font-semibold">
                    {job.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-gray-500" />
                    {job.location || "Remote"}
                  </p>
                  <p className="text-primary font-semibold mt-3">
                    {job.salary
                      ? `₹${job.salary.toLocaleString("en-IN")} / year`
                      : "Salary not disclosed"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:flex-shrink-0">
                  {isCandidateRole(role) ? (
                    <button
                      type="button"
                      onClick={() => handleApply(job.id)}
                      className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition"
                    >
                      Apply
                    </button>
                  ) : role ? (
                    <span className="text-xs text-gray-500 px-3 py-2 border border-border rounded-xl">
                      Recruiters cannot apply
                    </span>
                  ) : null}
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm text-primary hover:opacity-80 font-medium px-3 py-2"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
