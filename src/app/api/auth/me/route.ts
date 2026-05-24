import { NextResponse,NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req:NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: { userId: user.userId, role: user.role },
  });
}
