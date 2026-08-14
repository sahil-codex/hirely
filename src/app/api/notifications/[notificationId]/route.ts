import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

import {
  markNotificationReadService,
} from "@/services/notification.service";

type RouteContext = {
  params: Promise<{
    notificationId: string;
  }>;
};

export async function PATCH(
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

    const { notificationId } =
      await params;

    const notification =
      await markNotificationReadService(
        user,
        notificationId
      );

    return NextResponse.json({
      notification,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong";

    if (
      message ===
      "Notification not found"
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