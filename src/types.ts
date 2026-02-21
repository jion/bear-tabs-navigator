export interface TagNode {
  name: string;       // e.g. "ordergroove"
  fullPath: string;   // e.g. "ordergroove/ai-plans" (without #)
  count: number;      // number of notes with this exact tag or any child tag
  children: TagNode[];
}

export interface NoteCard {
  path: string;
  title: string;
  preview: string;
  mtime: number;
}

export interface BearNavigatorData {
  selectedTag: string | null;
  expandedTags: string[];
}
