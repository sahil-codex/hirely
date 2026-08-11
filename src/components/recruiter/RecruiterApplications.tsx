
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  Briefcase,
  Mail,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

type ApplicationStatus =
  | "APPLIED"
  | "PENDING"
  | "SHORTLISTED"
  | "REJECTED"
  | null;

type Application = {
  applicationId: string;
  status: ApplicationStatus;
  appliedAt: string | null;

  candidate: {
    id: string;
    fullName: string;
    email: string;
    headline?: string | null;
    location?: string | null;
    skills?: string[] | null;
    experience?: number | null;
    education?: string | null;
    resumeUrl?: string | null;
  };
};

type RecruiterApplicationsProps = {
  jobId: string;
};

export default function RecruiterApplications({
  jobId,
}: RecruiterApplicationsProps) {
  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = useCallback(
    async (isRefresh = false) => {
      if (!jobId) {
        setError("Job ID is required");
        setLoading(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const res = await fetch(
          `/api/jobs/${jobId}/applications`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Failed to load applications"
          );
        }

        setApplications(data.applications ?? []);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [jobId]
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async (
    applicationId: string,
    status: "SHORTLISTED" | "REJECTED"
  ) => {
    try {
      setUpdatingId(applicationId);
      setError("");

      const res = await fetch(
        `/api/applications/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to update application"
        );
      }

      setApplications((current) =>
        current.map((application) =>
          application.applicationId === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-4 border-t border-border pt-6">
        <div className="py-10 text-center text-zinc-400">
          Loading applications...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-border pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Applications
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {applications.length}{" "}
            {applications.length === 1
              ? "application"
              : "applications"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchApplications(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={
              refreshing ? "animate-spin" : ""
            }
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Empty state */}
      {applications.length === 0 && !error ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <FileText
            className="mx-auto mb-3 text-zinc-500"
            size={32}
          />

          <h3 className="text-lg font-semibold text-white">
            No applications yet
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            Candidates who apply to this job will
            appear here.
          </p>
        </div>
      ) : (
        /* Applications */
        <div className="space-y-4">
          {applications.map((application) => {
            const candidate = application.candidate;

            const isUpdating =
              updatingId === application.applicationId;

            return (
              <div
                key={application.applicationId}
                className="rounded-2xl border border-border bg-card p-6"
              >
                {/* Candidate header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                      {candidate.fullName
                        ?.charAt(0)
                        .toUpperCase() || "?"}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {candidate.fullName}
                      </h3>

                      {candidate.headline && (
                        <p className="mt-1 text-zinc-400">
                          {candidate.headline}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-500">
                        {candidate.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={15} />
                            {candidate.location}
                          </span>
                        )}

                        {candidate.experience !==
                          null &&
                          candidate.experience !==
                            undefined && (
                            <span className="flex items-center gap-1">
                              <Briefcase size={15} />

                              {candidate.experience}{" "}
                              {candidate.experience === 1
                                ? "year"
                                : "years"}
                            </span>
                          )}

                        <span className="flex items-center gap-1">
                          <Mail size={15} />
                          {candidate.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <StatusBadge
                    status={application.status}
                  />
                </div>

                {/* Skills */}
                {candidate.skills &&
                  candidate.skills.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-sm text-zinc-500">
                        Skills
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-border bg-white/5 px-3 py-1 text-sm text-zinc-300"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Education */}
                {candidate.education && (
                  <div className="mt-4">
                    <p className="text-sm text-zinc-500">
                      Education
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {candidate.education}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                  {/* Resume */}
                  {candidate.resumeUrl && (
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-white transition hover:bg-white/5"
                    >
                      <FileText size={16} />
                      View Resume
                    </a>
                  )}

                  {/* Shortlist / Reject */}
                  {(application.status ===
                    "PENDING" ||
                    application.status ===
                      "APPLIED" ||
                    application.status === null) && (
                    <>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            application.applicationId,
                            "SHORTLISTED"
                          )
                        }
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500 disabled:opacity-50"
                      >
                        <Check size={16} />

                        {isUpdating
                          ? "Updating..."
                          : "Shortlist"}
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            application.applicationId,
                            "REJECTED"
                          )
                        }
                        className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <X size={16} />

                        {isUpdating
                          ? "Updating..."
                          : "Reject"}
                      </button>
                    </>
                  )}

                  {/* Applied date */}
                  {application.appliedAt && (
                    <span className="ml-auto text-xs text-zinc-500">
                      Applied{" "}
                      {new Date(
                        application.appliedAt
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const styles: Record<
    NonNullable<ApplicationStatus>,
    string
  > = {
    APPLIED:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",

    PENDING:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    SHORTLISTED:
      "bg-green-500/10 text-green-400 border-green-500/20",

    REJECTED:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const label = status ?? "PENDING";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        styles[label]
      }`}
    >
      {label}
    </span>
  );
}

