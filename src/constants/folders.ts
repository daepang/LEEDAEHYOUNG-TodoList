import { colors } from "./color";

export type FolderType = "not-started" | "in-progress" | "pending" | "done";

export interface FolderConfig {
  key: FolderType;
  title: string;
  color: string;
}

export const FOLDER_CONFIGS: FolderConfig[] = [
  {
    key: "not-started",
    title: "시작전",
    color: colors.notStarted,
  },
  {
    key: "in-progress",
    title: "작업중",
    color: colors.inProgress,
  },
  {
    key: "pending",
    title: "보류중",
    color: colors.pending,
  },
  {
    key: "done",
    title: "완료",
    color: colors.done,
  },
];
