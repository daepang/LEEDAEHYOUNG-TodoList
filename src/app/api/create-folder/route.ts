import { NextResponse } from "next/server";
import { createFolder } from "../_fs";

export async function POST(req: Request) {
  const { path } = await req.json();
  if (!path)
    return NextResponse.json({ error: "path required" }, { status: 400 });

  try {
    await createFolder(path);
    return NextResponse.json({ ok: true, path });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
