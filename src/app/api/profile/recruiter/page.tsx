"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  Globe,
  MapPin,
  Save,
  User,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
type RecruiterProfile = {
  headline: string;
  bio: string;
  location: string;
  company: string;
  jobTitle: string;
  companyWebsite: string;
  linkedinUrl: string;
};

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

const initialProfile: RecruiterProfile = {
  headline: "",
  bio: "",
  location: "",
  company: "",
  jobTitle: "",
  companyWebsite: "",
  linkedinUrl: "",
};

export default function RecruiterProfilePage() {
  const [user, setUser] = useState<User | null>(
    null
  );

  const [profile, setProfile] =
    useState<RecruiterProfile>(initialProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const [userRes, profileRes] =
          await Promise.all([
            fetch("/api/auth/me", {
              credentials: "include",
            }),

            fetch("/api/recruiter-profile", {
              credentials: "include",
            }),
          ]);

        const userData = await userRes.json();
        const profileData =
          await profileRes.json();

        if (!userRes.ok) {
          throw new Error(
            userData.error ||
              "Failed to load user"
          );
        }

        if (!profileRes.ok) {
          throw new Error(
            profileData.error ||
              "Failed to load profile"
          );
        }

        if (userData.user) {
          setUser(userData.user);
        }

        if (profileData.profile) {
          setProfile((current) => ({
            ...current,
            ...profileData.profile,
          }));
        }
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

    loadProfile();
  }, []);

  function updateField(
    field: keyof RecruiterProfile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch(
        "/api/recruiter-profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(profile),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to save profile"
        );
      }

      if (data.profile) {
        setProfile((current) => ({
          ...current,
          ...data.profile,
        }));
      }

      setSuccess(
        "Profile updated successfully!"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-8">
          <p className="text-zinc-400">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          Unable to load your account.
        </div>
      </main>
    );
  }

  const initials = user.fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Recruiter Profile
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage your professional and company
          information.
        </p>
      </div>

      {/* Profile Hero */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="h-24 bg-gradient-to-r from-primary/30 via-indigo-500/20 to-violet-500/20" />

        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-primary text-2xl font-bold text-white shadow-lg">
              {initials || (
                <User size={30} />
              )}
            </div>

            <div className="pb-1">
              <h2 className="text-2xl font-bold text-white">
                {user.fullName}
              </h2>

              <p className="mt-1 text-zinc-400">
                {profile.headline ||
                  "Recruiter"}
              </p>

              {profile.location && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                  <MapPin size={15} />
                  {profile.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Messages */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Form */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white">
            Professional Information
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Keep your recruiter information up
            to date.
          </p>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={user.fullName}
                disabled
                className="w-full rounded-xl border border-border bg-black/10 px-10 py-3 text-zinc-400 outline-none"
              />
            </div>

            <p className="mt-1.5 text-xs text-zinc-500">
              Your name is managed through your
              account.
            </p>
          </div>

          {/* Headline */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Headline
            </label>

            <input
              value={profile.headline}
              onChange={(e) =>
                updateField(
                  "headline",
                  e.target.value
                )
              }
              placeholder="e.g. Technical Recruiter"
              maxLength={120}
              className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-white outline-none transition focus:border-primary"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Bio
            </label>

            <textarea
              value={profile.bio}
              onChange={(e) =>
                updateField(
                  "bio",
                  e.target.value
                )
              }
              placeholder="Tell candidates a little about yourself..."
              rows={5}
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-border bg-transparent px-4 py-3 text-white outline-none transition focus:border-primary"
            />

            <p className="mt-1 text-right text-xs text-zinc-500">
              {profile.bio.length}/1000
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Location
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={profile.location}
                onChange={(e) =>
                  updateField(
                    "location",
                    e.target.value
                  )
                }
                placeholder="e.g. Hyderabad, India"
                maxLength={100}
                className="w-full rounded-xl border border-border bg-transparent px-10 py-3 text-white outline-none transition focus:border-primary"
              />
            </div>
          </div>

          {/* Company */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Company
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  value={profile.company}
                  onChange={(e) =>
                    updateField(
                      "company",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Google"
                  maxLength={120}
                  className="w-full rounded-xl border border-border bg-transparent px-10 py-3 text-white outline-none transition focus:border-primary"
                />
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Job Title
              </label>

              <div className="relative">
                <Briefcase
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  value={profile.jobTitle}
                  onChange={(e) =>
                    updateField(
                      "jobTitle",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Senior Recruiter"
                  maxLength={120}
                  className="w-full rounded-xl border border-border bg-transparent px-10 py-3 text-white outline-none transition focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Company Website */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Company Website
            </label>

            <div className="relative">
              <Globe
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="url"
                value={
                  profile.companyWebsite
                }
                onChange={(e) =>
                  updateField(
                    "companyWebsite",
                    e.target.value
                  )
                }
                placeholder="https://example.com"
                className="w-full rounded-xl border border-border bg-transparent px-10 py-3 text-white outline-none transition focus:border-primary"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              LinkedIn
            </label>

            <div className="relative">
            <FaLinkedin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="url"
                value={
                  profile.linkedinUrl
                }
                onChange={(e) =>
                  updateField(
                    "linkedinUrl",
                    e.target.value
                  )
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-xl border border-border bg-transparent px-10 py-3 text-white outline-none transition focus:border-primary"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-border pt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}