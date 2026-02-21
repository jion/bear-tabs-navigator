import { App, setIcon } from "obsidian";
import { TagNode } from "./types";
import { buildTagTree, getTotalNoteCount } from "./tagUtils";

export class TagTree {
  private containerEl: HTMLElement;
  private app: App;
  private selectedTag: string | null = null;
  private expandedTags: Set<string>;
  public onTagSelect: (tag: string | null) => void = () => {};

  constructor(containerEl: HTMLElement, app: App, expandedTags: string[] = []) {
    this.containerEl = containerEl;
    this.app = app;
    this.expandedTags = new Set(expandedTags);
  }

  setSelectedTag(tag: string | null) {
    this.selectedTag = tag;
  }

  getExpandedTags(): string[] {
    return Array.from(this.expandedTags);
  }

  refresh() {
    this.containerEl.empty();
    const tree = buildTagTree(this.app);
    const totalCount = getTotalNoteCount(this.app);

    // "All Notes" entry
    this.renderAllNotes(totalCount);

    // Tag tree
    for (const node of tree) {
      this.renderNode(node, 0);
    }
  }

  private renderAllNotes(count: number) {
    const row = this.containerEl.createDiv({ cls: "bear-tag-item" });
    if (this.selectedTag === null) {
      row.addClass("bear-tag-item--selected");
    }

    const iconEl = row.createDiv({ cls: "bear-tag-icon" });
    setIcon(iconEl, "files");

    row.createDiv({ cls: "bear-tag-name", text: "All Notes" });
    row.createDiv({ cls: "bear-tag-count", text: String(count) });

    row.addEventListener("click", () => {
      this.selectedTag = null;
      this.onTagSelect(null);
      this.refreshSelection();
    });
  }

  private renderNode(node: TagNode, depth: number) {
    const row = this.containerEl.createDiv({ cls: "bear-tag-item" });
    row.style.paddingLeft = `${12 + depth * 20}px`;

    if (this.selectedTag === node.fullPath) {
      row.addClass("bear-tag-item--selected");
    }

    const hasChildren = node.children.length > 0;
    const isExpanded = this.expandedTags.has(node.fullPath);

    // Chevron
    const chevronEl = row.createDiv({ cls: "bear-tag-chevron" });
    if (hasChildren) {
      setIcon(chevronEl, "chevron-right");
      if (isExpanded) {
        chevronEl.addClass("bear-tag-chevron--expanded");
      }
      chevronEl.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.expandedTags.has(node.fullPath)) {
          this.expandedTags.delete(node.fullPath);
        } else {
          this.expandedTags.add(node.fullPath);
        }
        this.refresh();
      });
    }

    // Tag icon
    const iconEl = row.createDiv({ cls: "bear-tag-icon" });
    setIcon(iconEl, "hash");

    // Tag name
    row.createDiv({ cls: "bear-tag-name", text: node.name });

    // Count
    row.createDiv({ cls: "bear-tag-count", text: String(node.count) });

    // Click to select
    row.addEventListener("click", () => {
      this.selectedTag = node.fullPath;
      this.onTagSelect(node.fullPath);
      this.refreshSelection();
    });

    // Render children if expanded
    if (hasChildren && isExpanded) {
      for (const child of node.children) {
        this.renderNode(child, depth + 1);
      }
    }
  }

  private refreshSelection() {
    const items = this.containerEl.querySelectorAll(".bear-tag-item");
    items.forEach((item) => item.removeClass("bear-tag-item--selected"));

    // Re-highlight the selected one
    // Simplest approach: re-render
    this.refresh();
  }
}
