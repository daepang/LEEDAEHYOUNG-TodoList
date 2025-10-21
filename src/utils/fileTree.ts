import { type FileItem, type TreeNode } from "@/constants/types";

export function buildFileTree(items: FileItem[]): TreeNode[] {
  const tree: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  // 먼저 모든 항목을 노드로 변환
  items.forEach((item) => {
    // path 형식: /not-started/2025/09/2025-09-30.md
    const parts = item.path.split("/").filter(Boolean);
    // parts: ['not-started', '2025', '09', '2025-09-30.md']

    // 첫 번째는 폴더 타입이므로 제외하고 연도/월/파일명만 사용
    const pathParts = parts.slice(1); // ['2025', '09', '2025-09-30.md']

    let currentPath = `/${parts[0]}`; // '/not-started'

    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;

      // 이미 존재하는 노드인지 확인
      if (nodeMap.has(currentPath)) {
        return;
      }

      const isFile =
        item.type === "file" || (index === pathParts.length - 1 && !item.type);

      const newNode: TreeNode = {
        name: part,
        path: currentPath,
        type: isFile ? "file" : "folder",
      };

      if (!isFile) {
        newNode.children = [];
      }

      nodeMap.set(currentPath, newNode);
    });
  });

  // 트리 구조 구성
  nodeMap.forEach((node) => {
    const parts = node.path.split("/").filter(Boolean);

    if (parts.length === 2) {
      // 최상위 항목
      tree.push(node);
    } else {
      // 하위 항목 - 부모 찾기
      const parentPath = "/" + parts.slice(0, -1).join("/");
      const parent = nodeMap.get(parentPath);

      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  });

  // 정렬: 폴더가 먼저, 이름 순
  const sortTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        return b.name.localeCompare(a.name); // 최신순 (역순)
      })
      .map((node) => ({
        ...node,
        children: node.children ? sortTree(node.children) : undefined,
      }));
  };

  return sortTree(tree);
}
