import { Plugin } from "obsidian";
import { AiFilenameSettings, DEFAULT_SETTINGS, AiFilenameSettingTab } from "./settings";
import { registerCommands } from "./commands";

export default class AiFilenamePlugin extends Plugin {
  settings: AiFilenameSettings = DEFAULT_SETTINGS;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AiFilenameSettingTab(this.app, this));
    registerCommands(this);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
