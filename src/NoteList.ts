import { App, TFile } from "obsidian";
import { getNotesForTag } from "./tagUtils";
import { formatRelativeDate } from "./dateUtils";

const NOTES_PER_PAGE = 50;

export class NoteList {
  private containerEl: HTMLElement;
  private app: App;
  private currentTag: string | null = null;
  private displayedCount = 0;
  private allFiles: TFile[] = [];
  private activeFilePath: string | null = null;

  constructor(containerEl: HTMLElement, app: App) {
    this.containerEl = containerEl;
    this.app = app;
  }

  async showNotesForTag(tag: string | null) {
    this.currentTag = tag;
    this.allFiles = getNotesForTag(this.app, tag);
    this.displayedCount = 0;
    this.containerEl.empty();

    // Header
    const header = this.containerEl.createDiv({ cls: "bear-note-header" });
    const tagLabel = tag ? `#${tag}` : "All Notes";
    header.createDiv({ cls: "bear-note-header-title", text: tagLabel });
    header.createDiv({
      cls: "bear-note-header-count",
      text: `${this.allFiles.length} ${this.allFiles.length === 1 ? "note" : "notes"}`,
    });

    // Note list container
    const listEl = this.containerEl.createDiv({ cls: "bear-note-list" });

    await this.loadMore(listEl);
  }

  private async loadMore(listEl: HTMLElement) {
    const end = Math.min(this.displayedCount + NOTES_PER_PAGE, this.allFiles.length);
    const batch = this.allFiles.slice(this.displayedCount, end);

    for (const file of batch) {
      const preview = await this.getPreview(file);
      this.renderNoteCard(listEl, file, preview);
    }

    this.displayedCount = end;

    // Remove existing "Show more" button
    const existingBtn = this.containerEl.querySelector(".bear-show-more");
    if (existingBtn) existingBtn.remove();

    if (this.displayedCount < this.allFiles.length) {
      const btn = this.containerEl.createDiv({
        cls: "bear-show-more",
        text: `Show more (${this.allFiles.length - this.displayedCount} remaining)`,
      });
      btn.addEventListener("click", () => this.loadMore(listEl));
    }
  }

  private renderNoteCard(listEl: HTMLElement, file: TFile, preview: string) {
    const card = listEl.createDiv({ cls: "bear-note-card" });

    if (this.activeFilePath === file.path) {
      card.addClass("bear-note-card--active");
    }

    card.createDiv({ cls: "bear-note-card-title", text: file.basename });

    if (preview) {
      card.createDiv({ cls: "bear-note-card-preview", text: preview });
    }

    card.createDiv({
      cls: "bear-note-card-date",
      text: formatRelativeDate(file.stat.mtime),
    });

    card.addEventListener("click", () => {
      this.app.workspace.getLeaf(false).openFile(file);
    });
  }

  private async getPreview(file: TFile): Promise<string> {
    try {
      const content = await this.app.vault.cachedRead(file);
      // Strip frontmatter
      let text = content;
      if (text.startsWith("---")) {
        const endIndex = text.indexOf("---", 3);
        if (endIndex !== -1) {
          text = text.substring(endIndex + 3);
        }
      }
      // Strip markdown headers, links, images, and excessive whitespace
      text = text
        .replace(/^#+\s+/gm, "")
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
        .replace(/\n{2,}/g, " ")
        .trim();
      return text.substring(0, 150);
    } catch {
      return "";
    }
  }

  setActiveFile(path: string | null) {
    this.activeFilePath = path;
    // Update highlight
    const cards = this.containerEl.querySelectorAll(".bear-note-card");
    cards.forEach((card, index) => {
      if (index < this.allFiles.length && this.allFiles[index]?.path === path) {
        card.addClass("bear-note-card--active");
      } else {
        card.removeClass("bear-note-card--active");
      }
    });
  }

  getCurrentTag(): string | null {
    return this.currentTag;
  }
}
