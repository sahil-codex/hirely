import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: { userId: user.userId, role: user.role },
  });
}
