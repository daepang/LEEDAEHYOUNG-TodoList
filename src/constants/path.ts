// 경로 상수 정의
export const PATHS = {
  HOME: {
    path: "/",
    name: "홈",
  },
} as const;

// 타입 헬퍼
export type PathKey = keyof typeof PATHS;
export type PathInfo = (typeof PATHS)[PathKey];
