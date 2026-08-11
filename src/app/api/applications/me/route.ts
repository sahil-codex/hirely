import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { getCandidateApplicationsService } from "@/services/application.service";

export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const applications =
      await getCandidateApplicationsService(user);

    return NextResponse.json({
      applications,
    });
  } catch (err: unknown) {
    console.error(
      "GET MY APPLICATIONS ERROR:",
      err
    );

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