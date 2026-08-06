import cloudinary from "@/lib/cloudinary";

export async function uploadResume(
  file: Buffer,
  fileName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "hirely/resumes",
          resource_type: "raw", // PDFs, DOCX, etc.
          public_id: fileName.replace(/\.[^/.]+$/, ""),
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve(result.secure_url);
        }
      )
      .end(file);
  });
}