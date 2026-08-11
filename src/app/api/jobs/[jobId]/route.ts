import { NextResponse } from "next/server";
import {
  deleteJobService,
  getJobDetailsService,
} from "@/services/job.service";
import { getUserFromRequest } from "@/lib/getUser";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

// GET /api/jobs/[jobId]
export async function GET(
  _req: Request,
  { params }: RouteContext
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await getJobDetailsService(jobId);

    return NextResponse.json({
      job,
    });
  } catch (err: unknown) {
    console.error("GET JOB ERROR:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong";

    return NextResponse.json(
      { error: message },
      { status: 404 }
    );
  }
}

// DELETE /api/jobs/[jobId]
export async function DELETE(
  _req: Request,
  { params }: RouteContext
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const job = await deleteJobService(
      user,
      jobId
    );

    return NextResponse.json({
      job,
    });
  } catch (err: unknown) {
    console.error("DELETE JOB ERROR:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}