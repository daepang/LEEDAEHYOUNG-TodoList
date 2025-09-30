// src/app/api/files/route.ts
import { NextResponse } from "next/server";
import { listFiles, type FolderType } from "../_fs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folder = (searchParams.get("folder") as FolderType) ?? "not-started";
  const files = await listFiles(folder);
  return NextResponse.json({ files });
}
