import { NextResponse } from "next/server";
import { fetchUsers, upsertUser } from "@/lib/supabase-data";

export async function GET() {
  const users = await fetchUsers();
  if (users === null) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  try {
    const user = await request.json();
    const success = await upsertUser(user);
    if (!success) {
      return NextResponse.json({ error: "Failed to upsert user" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
