import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { uploadResumeService } from "@/services/resume.service";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Resume is required" },
        { status: 400 }
      );
    }

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Only PDF or Word documents are allowed",
        },
        { status: 400 }
      );
    }

    const resumeUrl = await uploadResumeService(
      user.userId,
      file
    );

    return NextResponse.json({
      resumeUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Upload failed",
      },
      { status: 500 }
    );
  }
}