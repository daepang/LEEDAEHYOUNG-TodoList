import { NextResponse } from "next/server";
import { renamePath } from "../_fs";

export async function POST(req: Request) {
  const { path, newName } = await req.json();
  if (!path || !newName) {
    return NextResponse.json(
      { error: "path and newName required" },
      { status: 400 }
    );
  }

  try {
    const newPath = await renamePath(path, newName);
    return NextResponse.json({ ok: true, newPath });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
