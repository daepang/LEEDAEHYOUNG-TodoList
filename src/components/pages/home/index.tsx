"use client";

import { TodoTemplate } from "@/components/templates/TodoTemplate";
import { useTodoFiles } from "./common/useTodoFiles";
import { useSaveShortcut } from "./common/useSaveShortcut";

export function HomePage() {
  const {
    notStarted,
    inProgress,
    pending,
    done,
    active,
    content,
    saving,
    setContent,
    openFile,
    handleSave,
    handleCreateFile,
    onDragStart,
    onDropTo,
    handleCreateFolder,
    handleDelete,
    handleRename,
  } = useTodoFiles();

  useSaveShortcut(handleSave, !!active);

  return (
    <TodoTemplate
      notStarted={notStarted}
      inProgress={inProgress}
      pending={pending}
      done={done}
      activeFile={active}
      content={content}
      saving={saving}
      onContentChange={setContent}
      onDragStart={onDragStart}
      onDropTo={onDropTo}
      onFileClick={openFile}
      onCreateFile={handleCreateFile}
      onSave={handleSave}
      onCreateFolder={handleCreateFolder}
      onDelete={handleDelete}
      onRename={handleRename}
    />
  );
}
