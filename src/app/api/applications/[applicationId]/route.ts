import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

import {
  updateApplicationsStatusService,
} from "@/services/application.service";

import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum([
    "SHORTLISTED",
    "REJECTED",
  ]),
});

type RouteContext = {
  params: Promise<{
    applicationId: string;
  }>;
};

export async function PATCH(
  req: Request,
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

    const { applicationId } = await params;

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const parsed =
      updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const application =
      await updateApplicationsStatusService(
        {
          userId: user.userId,
          role: user.role,
        },
        applicationId,
        parsed.data.status
      );

    return NextResponse.json({
      application,
    });
  } catch (err: unknown) {
    console.error(
      "UPDATE APPLICATION STATUS ERROR:",
      err
    );

    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong";

    if (
      message === "Forbidden"
    ) {
      return NextResponse.json(
        { error: message },
        { status: 403 }
      );
    }

    if (
      message ===
      "Application not found or unauthorized"
    ) {
      return NextResponse.json(
        { error: message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}