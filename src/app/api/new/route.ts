// src/app/api/new/route.ts
import { NextResponse } from "next/server";
import { writeFileByVaultPath } from "../_fs";

const tmpl = (dateStr: string) => `# ${dateStr} TODO

## 오늘 할 일
- [✅] 예시: 아침 운동
- [ ] 예시: 코드 리뷰

## 완료됨

---

## 메모
`;

export async function POST() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const ddFixed = String(d.getDate()).padStart(2, "0");
  const fileName = `${yyyy}-${mm}-${ddFixed}.md`;
  const file = `/not-started/${yyyy}/${mm}/${fileName}`;
  await writeFileByVaultPath(file, tmpl(`${yyyy}-${mm}-${ddFixed}`));
  return NextResponse.json({ path: file });
}
