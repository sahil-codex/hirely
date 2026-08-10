"use client";

import { useRef, useState } from "react";

type ResumeSectionProps = {
  resumeUrl?: string | null;
  onUploaded: (resumeUrl: string) => void;
};

export default function ResumeSection({
  resumeUrl,
  onUploaded,
}: ResumeSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF or Word documents are allowed.");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Resume must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/profile/resume", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Resume upload failed.");
      }

      onUploaded(data.resumeUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Resume upload failed."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white">
        Resume
      </h2>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          {resumeUrl ? (
            <>
              <p className="text-white">📄 Resume</p>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Resume
              </a>
            </>
          ) : (
            <p className="text-zinc-400">
              No resume uploaded yet.
            </p>
          )}
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="border border-border px-4 py-2 rounded-lg hover:bg-white/5 transition disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : resumeUrl
              ? "Replace Resume"
              : "Upload Resume"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </section>
  );
}