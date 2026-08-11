import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

import {
  getApplicationsForJobService,
} from "@/services/application.service";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function GET(
  _req: Request,
  { params }: RouteContext
) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const applications =
      await getApplicationsForJobService(
        {
          userId: user.userId,
          role: user.role,
        },
        jobId
      );

    return NextResponse.json({
      applications,
    });
  } catch (err: unknown) {
    console.error(
      "GET JOB APPLICATIONS ERROR:",
      err
    );

    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong";

    if (
      message === "Only recruiters allowed"
    ) {
      return NextResponse.json(
        { error: message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}