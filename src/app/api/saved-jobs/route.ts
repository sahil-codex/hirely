import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

import {
  getSavedJobsService,
} from "@/services/savedJob.service";

export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jobs =
      await getSavedJobsService(user);

    return NextResponse.json({
      jobs,
    });
  } catch (err: unknown) {
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

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}