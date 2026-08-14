import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

import {
  getNotificationsService,
  markAllNotificationsReadService,
} from "@/services/notification.service";

export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const notifications =
      await getNotificationsService(user);

    return NextResponse.json({
      notifications,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await markAllNotificationsReadService(
      user
    );

    return NextResponse.json({
      success: true,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}