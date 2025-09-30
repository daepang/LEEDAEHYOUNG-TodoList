// src/app/api/move/route.ts
import { NextResponse } from "next/server";
import { moveFile } from "../_fs";

export async function POST(req: Request) {
  const { from, to } = await req.json();
  if (!from || !to) return NextResponse.json({ error: "from/to required" }, { status: 400 });
  await moveFile(from, to);
  return NextResponse.json({ ok: true });
}
