import { uploadResume } from "./upload.service";
import { updateResumeUrl } from "@/repositories/profile.repository";

export async function uploadResumeService(
  userId: string,
  file: File
) {
  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const resumeUrl = await uploadResume(
    buffer,
    `${userId}-${Date.now()}`
  );

  console.log("CLOUDINARY URL:", resumeUrl);

  const profile = await updateResumeUrl(
    userId,
    resumeUrl
  );

  console.log("PROFILE AFTER UPDATE:", profile);

  return profile.resumeUrl;
}