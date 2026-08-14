import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

import {
  saveJobService,
  unsaveJobService,
  getJobSavedStatusService,
} from "@/services/savedJob.service";

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

    const result =
      await getJobSavedStatusService(
        user,
        jobId
      );

    return NextResponse.json(result);
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function POST(
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

    const result = await saveJobService(
      user,
      jobId
    );

    return NextResponse.json(result);
  } catch (err: unknown) {
    return handleError(err);
  }
}

export async function DELETE(
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

    const result =
      await unsaveJobService(
        user,
        jobId
      );

    return NextResponse.json(result);
  } catch (err: unknown) {
    return handleError(err);
  }
}

function handleError(err: unknown) {
  const message =
    err instanceof Error
      ? err.message
      : "Something went wrong";

  if (
    message ===
    "Only candidates can save jobs"
  ) {
    return NextResponse.json(
      { error: message },
      { status: 403 }
    );
  }

  if (message === "Job not found") {
    return NextResponse.json(
      { error: message },
      { status: 404 }
    );
  }

  if (message === "Job ID is required") {
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}