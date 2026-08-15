import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";
import { getUserById } from "@/repositories/user.repository";

export async function GET() {
  const payload = await getUserFromRequest();

  if (!payload) {
    return NextResponse.json({ user: null });
  }

  const user = await getUserById(payload.userId);

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
    },
  });
}