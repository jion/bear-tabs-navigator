import { App, TFile, getAllTags } from "obsidian";
import { TagNode } from "./types";

export function buildTagTree(app: App): TagNode[] {
  const tagCounts = new Map<string, number>();
  const files = app.vault.getMarkdownFiles();

  for (const file of files) {
    const cache = app.metadataCache.getFileCache(file);
    if (!cache) continue;
    const tags = getAllTags(cache) ?? [];
    const seen = new Set<string>();
    for (const tag of tags) {
      const normalized = tag.substring(1).toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        tagCounts.set(normalized, (tagCounts.get(normalized) || 0) + 1);
      }
    }
  }

  const root: TagNode[] = [];
  const nodeMap = new Map<string, TagNode>();

  const sortedTags = Array.from(tagCounts.keys()).sort();

  for (const fullTag of sortedTags) {
    const parts = fullTag.split("/");
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const prevPath = currentPath;
      currentPath = i === 0 ? parts[i] : currentPath + "/" + parts[i];

      if (!nodeMap.has(currentPath)) {
        const node: TagNode = {
          name: parts[i],
          fullPath: currentPath,
          count: 0,
          children: [],
        };
        nodeMap.set(currentPath, node);

        if (i === 0) {
          root.push(node);
        } else {
          const parent = nodeMap.get(prevPath);
          if (parent) {
            parent.children.push(node);
          }
        }
      }
    }

    const node = nodeMap.get(fullTag);
    if (node) {
      node.count = tagCounts.get(fullTag) || 0;
    }
  }

  // Propagate child counts upward
  function sumCounts(node: TagNode): number {
    let total = node.count;
    for (const child of node.children) {
      total += sumCounts(child);
    }
    node.count = total;
    return total;
  }

  for (const node of root) {
    sumCounts(node);
  }

  return root;
}

export function getNotesForTag(app: App, tag: string | null): TFile[] {
  const files = app.vault.getMarkdownFiles();

  if (tag === null) {
    return files.sort((a, b) => b.stat.mtime - a.stat.mtime);
  }

  const tagLower = tag.toLowerCase();

  return files
    .filter((file) => {
      const cache = app.metadataCache.getFileCache(file);
      if (!cache) return false;
      const tags = getAllTags(cache) ?? [];
      return tags.some((t) => {
        const normalized = t.substring(1).toLowerCase();
        return normalized === tagLower || normalized.startsWith(tagLower + "/");
      });
    })
    .sort((a, b) => b.stat.mtime - a.stat.mtime);
}

export function getTotalNoteCount(app: App): number {
  return app.vault.getMarkdownFiles().length;
}
