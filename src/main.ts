import { Plugin } from "obsidian";
import { BearView, VIEW_TYPE_BEAR } from "./BearView";
import { BearNavigatorData } from "./types";

const DEFAULT_SETTINGS: BearNavigatorData = {
  selectedTag: null,
  expandedTags: [],
};

export default class BearTabsNavigatorPlugin extends Plugin {
  settings: BearNavigatorData = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();

    this.registerView(VIEW_TYPE_BEAR, (leaf) => new BearView(leaf, this));

    this.addRibbonIcon("layout-list", "Open Bear Navigator", () => {
      this.activateView();
    });

    this.addCommand({
      id: "open-bear-navigator",
      name: "Open Bear Navigator",
      callback: () => this.activateView(),
    });

    // Auto-open if layout is ready, otherwise wait
    if (this.app.workspace.layoutReady) {
      this.initLeaf();
    } else {
      this.app.workspace.onLayoutReady(() => this.initLeaf());
    }
  }

  onunload() {
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_BEAR)
      .forEach((leaf) => leaf.detach());
  }

  private initLeaf() {
    if (this.app.workspace.getLeavesOfType(VIEW_TYPE_BEAR).length) {
      return;
    }
    // Don't auto-open on first load - user will use ribbon or command
  }

  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_BEAR);
    if (existing.length) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }

    const leaf = this.app.workspace.getLeftLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE_BEAR, active: true });
      this.app.workspace.revealLeaf(leaf);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
