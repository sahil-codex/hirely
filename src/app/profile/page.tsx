"use client";
import ResumeSection from "@/components/profile/ResumeSection";
import { useEffect, useState } from "react";
import ProfileHero from "@/components/profile/profileHero";
import ProfileProgress from "src/components/profile/ProfileProgress";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (data.error === "Only candidates can access profiles") {
            router.replace("/profile/recruiter");
            return;
          }
          throw new Error(data.error || "Failed to load profile");
        }

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
  }, [router]);

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

        <div className="space-y-3 md:col-span-2">
  <label className="text-sm font-medium text-white">
    Skills
  </label>

  <input
    placeholder="Type a skill and press Enter"
    className="input"
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        const skill = e.currentTarget.value.trim();

        if (!skill) return;

        setProfile((prev) => ({
          ...prev,
          skills: prev.skills?.includes(skill)
            ? prev.skills
            : [...(prev.skills ?? []), skill],
        }));

        e.currentTarget.value = "";
      }
    }}
  />

  <div className="flex flex-wrap gap-2">
    {profile.skills?.map((skill) => (
      <div
        key={skill}
        className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary"
      >
        <span>{skill}</span>

        <button
          type="button"
          onClick={() =>
            setProfile((prev) => ({
              ...prev,
              skills: prev.skills?.filter((s) => s !== skill),
            }))
          }
          className="text-zinc-400 hover:text-red-400"
        >
           <X className="h-4 w-4" />
        </button>
      </div>
    ))}
  </div>
</div>

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

         <ResumeSection
    resumeUrl={profile.resumeUrl}
    onUploaded={(resumeUrl) =>
      setProfile((prev) => ({
        ...prev,
        resumeUrl,
      }))
    }
  />

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