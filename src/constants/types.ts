export interface FileItem {
  name: string;
  path: string;
  type?: "file" | "folder";
}

export interface TreeNode {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: TreeNode[];
}
