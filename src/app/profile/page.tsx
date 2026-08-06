"use client";

import { useEffect, useState } from "react";
import ProfileHero from "@/components/profile/profileHero";
import ProfileProgress from "src/components/profile/ProfileProgress";

type Profile = {
  fullName: string;
  headline?: string;
  bio?: string;
  location?: string;
  experience?: number;
  education?: string;
  company?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    headline: "",
    bio: "",
    location: "",
    experience: 0,
    education: "",
    company: "",
    skills: [],
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
  });

  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [resume, setResume] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await res.json();

        if (data.profile) {
          setProfile((prev) => ({
            ...prev,
            ...data.profile,
          }));
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile.");
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResumeUpload = async () => {
  if (!resume) {
    setError("Please select a resume first.");
    return;
  }

  try {
    setUploadingResume(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("resume", resume);

    const res = await fetch("/api/profile/resume", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to upload resume.");
    }

    setProfile((prev) => ({
      ...prev,
      resumeUrl: data.resumeUrl,
    }));

    setResume(null);
    setSuccess("Resume uploaded successfully.");
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Something went wrong.");
    }
  } finally {
    setUploadingResume(false);
  }
};

  if (loading) {
    return <p className="text-white">Loading profile...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Profile
        </h1>

        <p className="text-zinc-400 mt-2">
          Manage your professional profile
        </p>
      </div>

      <ProfileHero
        fullName={profile.fullName}
        headline={profile.headline}
        location={profile.location}
        experience={profile.experience}
        education={profile.education}
        skills={profile.skills}
      />

      <ProfileProgress profile={profile} />

      <div className="mt-8 rounded-2xl border border-border bg-card p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Professional Information
          </h2>

          <p className="mt-1 text-zinc-400">
            Keep your profile updated so recruiters know you better.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-green-400">
            {success}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <input
            value={profile.fullName}
            placeholder="Full Name"
            onChange={(e) =>
              setProfile({
                ...profile,
                fullName: e.target.value,
              })
            }
            className="input"
          />

          <input
            value={profile.headline ?? ""}
            placeholder="Professional Headline"
            onChange={(e) =>
              setProfile({
                ...profile,
                headline: e.target.value,
              })
            }
            className="input"
          />

          <input
            value={profile.location ?? ""}
            placeholder="Location"
            onChange={(e) =>
              setProfile({
                ...profile,
                location: e.target.value,
              })
            }
            className="input"
          />

          <input
            type="number"
            value={profile.experience ?? ""}
            placeholder="Years of Experience"
            onChange={(e) =>
              setProfile({
                ...profile,
                experience: Number(e.target.value),
              })
            }
            className="input"
          />

                    <input
            value={profile.education ?? ""}
            placeholder="Education"
            onChange={(e) =>
              setProfile({
                ...profile,
                education: e.target.value,
              })
            }
            className="input"
          />

          <input
            value={profile.company ?? ""}
            placeholder="Current Company"
            onChange={(e) =>
              setProfile({
                ...profile,
                company: e.target.value,
              })
            }
            className="input"
          />
        </div>

        <textarea
          rows={5}
          value={profile.bio ?? ""}
          placeholder="Tell recruiters about yourself..."
          onChange={(e) =>
            setProfile({
              ...profile,
              bio: e.target.value,
            })
          }
          className="input resize-none"
        />

        <input
          value={profile.skills?.join(", ") ?? ""}
          placeholder="React, Next.js, PostgreSQL..."
          onChange={(e) =>
            setProfile({
              ...profile,
              skills: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          className="input"
        />

        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">
            Professional Links
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            <input
              value={profile.githubUrl ?? ""}
              placeholder="GitHub URL"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  githubUrl: e.target.value,
                })
              }
              className="input"
            />

            <input
              value={profile.linkedinUrl ?? ""}
              placeholder="LinkedIn URL"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  linkedinUrl: e.target.value,
                })
              }
              className="input"
            />

            <input
              value={profile.portfolioUrl ?? ""}
              placeholder="Portfolio URL"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  portfolioUrl: e.target.value,
                })
              }
              className="input"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-white">
            Resume
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setResume(e.target.files?.[0] ?? null)
            }
            className="block w-full text-sm text-zinc-300
              file:mr-4
              file:rounded-lg
              file:border-0
              file:bg-primary
              file:px-4
              file:py-2
              file:text-white
              hover:file:opacity-90"
          />

          {resume && (
            <p className="text-sm text-zinc-400">
              Selected: {resume.name}
            </p>
          )}

          <button
            type="button"
            onClick={handleResumeUpload}
            disabled={uploadingResume || !resume}
            className="rounded-lg bg-primary px-4 py-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadingResume ? "Uploading..." : "Upload Resume"}
          </button>

          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-primary underline"
            >
              View Uploaded Resume
            </a>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={savingProfile}
            className="rounded-xl bg-primary px-6 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}