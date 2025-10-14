# 💾 LEEDAEHYOUNG TodoList

> 로컬 마크다운 기반 할 일 관리 애플리케이션

Next.js + TypeScript로 만든 파일 시스템 기반 Todo 관리 도구입니다. 모든 데이터는 로컬 마크다운(`.md`) 파일로 저장되며, Git으로 버전 관리할 수 있습니다.

## ✨ 주요 기능

### 📁 4단계 워크플로우

- **시작전** - 계획 단계의 할 일
- **작업중** - 현재 진행 중인 작업
- **보류중** - 대기 상태의 작업
- **완료** - 완료된 작업

### 🗂️ 연도/월별 자동 구조화

```
vault/
  ├── not-started/
  │   └── 2025/
  │       └── 09/
  │           └── 2025-09-30.md
  ├── in-progress/
  ├── pending/
  └── done/
```

### 🌲 트리 뷰 & 폴더 관리

- ➕/➖ 버튼으로 폴더 접기/펼치기
- 빈 폴더도 표시
- 우클릭 메뉴로 폴더/파일 관리
  - 새 폴더 생성
  - 이름 변경
  - 삭제

### 🎯 직관적인 UI/UX

- **드래그 앤 드롭** - 파일을 드래그하여 상태 간 이동
- **마크다운 에디터** - 실시간 미리보기 지원
- **단축키** - `Ctrl/Cmd + S`로 빠른 저장
- **알림** - 저장 완료/실패 피드백

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
# http://localhost:719
```

### 빌드

```bash
pnpm build
pnpm start
```

## 📂 프로젝트 구조

```
LEEDAEHYOUNG-TodoList/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── _fs.ts         # 파일 시스템 유틸리티
│   │   │   ├── files/         # 파일 목록 API
│   │   │   ├── file/          # 파일 읽기/쓰기 API
│   │   │   ├── move/          # 파일 이동 API
│   │   │   ├── new/           # 새 파일 생성 API
│   │   │   ├── create-folder/ # 폴더 생성 API
│   │   │   ├── delete/        # 삭제 API
│   │   │   └── rename/        # 이름 변경 API
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── icon.svg
│   ├── components/            # Atomic Design 구조
│   │   ├── atoms/            # 기본 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   └── Footer.tsx
│   │   ├── molecules/        # 조합 컴포넌트
│   │   │   ├── FileItem.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   ├── TreeItem.tsx
│   │   │   └── ContextMenu.tsx
│   │   ├── organisms/        # 복합 컴포넌트
│   │   │   ├── FileList.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Editor.tsx
│   │   ├── templates/        # 페이지 템플릿
│   │   │   └── TodoTemplate.tsx
│   │   └── pages/            # 페이지 컴포넌트
│   │       └── HomePage.tsx
│   ├── constants/            # 상수 정의
│   │   ├── color.ts         # 색상 팔레트
│   │   ├── folders.ts       # 폴더 설정
│   │   └── types.ts         # 타입 정의
│   ├── hooks/               # 커스텀 훅
│   │   ├── useTodoFiles.ts
│   │   └── useSaveShortcut.ts
│   └── utils/               # 유틸리티 함수
│       ├── api.ts           # API 호출
│       └── fileTree.ts      # 트리 구조 변환
└── vault/                   # 데이터 저장소
    ├── not-started/
    ├── in-progress/
    ├── pending/
    └── done/
```

## 🎨 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: React 18 + Inline Styles
- **Markdown**: react-markdown + remark-gfm
- **Package Manager**: pnpm
- **Architecture**: Atomic Design Pattern

## 💡 주요 기능 상세

### 1. 파일 관리

- ✅ 오늘 날짜 파일 자동 생성 (YYYY-MM-DD.md)
- ✅ 연도/월별 폴더 자동 정리
- ✅ 드래그 앤 드롭으로 상태 변경
- ✅ 파일/폴더 이름 변경
- ✅ 파일/폴더 삭제

### 2. 에디터

- ✅ 마크다운 문법 지원 (GFM)
- ✅ 실시간 미리보기
- ✅ 체크박스 지원 (`- [ ]`, `- [x]`)
- ✅ 자동 저장 (Ctrl/Cmd+S)

### 3. UI/UX

- ✅ 4단계 상태 관리 (색상 구분)
- ✅ 트리 뷰 (접기/펼치기)
- ✅ 우클릭 컨텍스트 메뉴
- ✅ 반응형 레이아웃
- ✅ 푸터 정보 표시

## 🔧 설정

### 포트 변경

`package.json`에서 포트 번호를 변경할 수 있습니다:

```json
{
  "scripts": {
    "dev": "next dev -p 719"
  }
}
```

### 색상 테마 변경

`src/constants/color.ts`에서 전체 색상 팔레트를 관리합니다:

```typescript
export const colors = {
  primary: "#0a66c2",
  notStarted: "#6b7280",
  inProgress: "#2563eb",
  pending: "#d97706",
  done: "#16a34a",
  // ...
};
```

## 📝 사용법

### 1. 새 할 일 만들기

- "오늘 파일 만들기" 버튼 클릭
- 자동으로 오늘 날짜 파일 생성 (`/not-started/2025/09/2025-09-30.md`)

### 2. 상태 변경

- 파일을 드래그하여 원하는 상태로 이동
- 자동으로 해당 폴더로 파일 이동

### 3. 폴더 관리

- "+ 폴더" 버튼: 최상위 폴더 생성
- 폴더 우클릭 → "새 폴더": 하위 폴더 생성
- 우클릭 → "이름 변경" / "삭제"

### 4. 파일 편집

- 왼쪽: 마크다운 에디터
- 오른쪽: 실시간 미리보기
- `Ctrl/Cmd + S`: 저장

## ⚠️ 주의사항

- **로컬 전용**: 파일 시스템을 직접 사용하므로 로컬 환경에서만 정상 작동합니다
- **버전 관리**: `vault/` 폴더를 Git에 커밋하여 데이터를 백업할 수 있습니다
- **배포 제한**: Vercel 등 서버리스 환경에서는 파일 쓰기가 제한될 수 있습니다

## 🗂️ 마크다운 템플릿

새 파일 생성 시 다음 템플릿이 자동으로 생성됩니다:

```markdown
# 2025-09-30 TODO

## 오늘 할 일

- [ ] 예시: 아침 운동
- [ ] 예시: 코드 리뷰

## 완료됨

---

## 메모
```

## 📄 라이선스

DAEPANG

## 🙋‍♂️ 개발자

LEEDAEHYOUNG

---

**Made with 💾 Next.js + TypeScript**
