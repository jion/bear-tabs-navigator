import { ItemView, WorkspaceLeaf, debounce, TFile } from "obsidian";
import { TagTree } from "./TagTree";
import { NoteList } from "./NoteList";
import type BearTabsNavigatorPlugin from "./main";

export const VIEW_TYPE_BEAR = "bear-tabs-navigator";

export class BearView extends ItemView {
  private tagTree: TagTree;
  private noteList: NoteList;
  private plugin: BearTabsNavigatorPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: BearTabsNavigatorPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return VIEW_TYPE_BEAR;
  }

  getDisplayText(): string {
    return "Bear Navigator";
  }

  getIcon(): string {
    return "layout-list";
  }

  async onOpen() {
    const container = this.contentEl;
    container.empty();
    container.addClass("bear-nav-container");

    const tagPanel = container.createDiv({ cls: "bear-tag-panel" });
    const notePanel = container.createDiv({ cls: "bear-note-panel" });

    const data = this.plugin.settings;

    this.tagTree = new TagTree(tagPanel, this.app, data.expandedTags);
    this.noteList = new NoteList(notePanel, this.app);

    this.tagTree.onTagSelect = (tag: string | null) => {
      this.plugin.settings.selectedTag = tag;
      this.plugin.saveSettings();
      this.noteList.showNotesForTag(tag);
    };

    // Restore selected tag
    this.tagTree.setSelectedTag(data.selectedTag);
    this.tagTree.refresh();
    await this.noteList.showNotesForTag(data.selectedTag);

    // Highlight active file
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      this.noteList.setActiveFile(activeFile.path);
    }

    // Reactivity: refresh on metadata changes (debounced)
    const debouncedRefresh = debounce(() => {
      const currentTag = this.noteList.getCurrentTag();
      this.tagTree.setSelectedTag(currentTag);
      this.tagTree.refresh();
      this.noteList.showNotesForTag(currentTag);
    }, 500, true);

    this.registerEvent(
      this.app.metadataCache.on("resolved", debouncedRefresh)
    );

    // Highlight active note on file open
    this.registerEvent(
      this.app.workspace.on("file-open", (file: TFile | null) => {
        this.noteList.setActiveFile(file?.path ?? null);
      })
    );
  }

  async onClose() {
    // Save expanded state
    if (this.tagTree) {
      this.plugin.settings.expandedTags = this.tagTree.getExpandedTags();
      this.plugin.saveSettings();
    }
  }
}
