import { NextResponse } from "next/server";

import { getUserFromRequest } from "@/lib/getUser";

import {
  getRecruiterProfileService,
  saveRecruiterProfileService,
} from "@/services/recruiterProfile.service";

import {
  recruiterProfileSchema,
} from "@/validators/recruiterProfile.validator";

export async function GET() {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile =
      await getRecruiterProfileService(user);

    return NextResponse.json({
      profile,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong";

    if (
      message.startsWith("Only recruiters")
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

export async function PATCH(
  req: Request
) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const parsed =
      recruiterProfileSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const profile =
      await saveRecruiterProfileService(
        user,
        parsed.data
      );

    return NextResponse.json({
      profile,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong";

    if (
      message.startsWith("Only recruiters")
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