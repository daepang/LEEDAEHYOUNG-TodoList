import { NextResponse } from "next/server";
import { deletePath } from "../_fs";

export async function POST(req: Request) {
  const { path } = await req.json();
  if (!path)
    return NextResponse.json({ error: "path required" }, { status: 400 });

  try {
    await deletePath(path);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
