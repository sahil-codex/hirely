import { NextResponse } from "next/server";
import { getDashboardService } from "@/services/dashboard.service";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "RECRUITER") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const dashboard = await getDashboardService(user);

    return NextResponse.json({ dashboard });
  } catch (err: unknown) {
    console.error("GET DASHBOARD ERROR:", err);

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