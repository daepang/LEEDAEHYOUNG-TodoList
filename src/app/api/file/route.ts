// src/app/api/file/route.ts
import { NextResponse } from "next/server";
import { readFileByVaultPath, writeFileByVaultPath } from "../_fs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const p = searchParams.get("path");
  if (!p) return NextResponse.json({ error: "path required" }, { status: 400 });
  try {
    const content = await readFileByVaultPath(p);
    return NextResponse.json({ content });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

export async function POST(req: Request) {
  const { path, content } = await req.json();
  if (!path) return NextResponse.json({ error: "path required" }, { status: 400 });
  await writeFileByVaultPath(path, content ?? "");
  return NextResponse.json({ ok: true });
}
