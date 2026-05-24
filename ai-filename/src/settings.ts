import { App, PluginSettingTab, Setting } from "obsidian";
import type AiFilenamePlugin from "./main";

export interface AiFilenameSettings {
  ollamaUrl: string;
  ollamaModel: string;
  maxSlugLength: number;
  draftPrefix: string;
}

export const DEFAULT_SETTINGS: AiFilenameSettings = {
  ollamaUrl: "http://localhost:11434",
  ollamaModel: "llama3.2",
  maxSlugLength: 50,
  draftPrefix: "_draft-",
};

export class AiFilenameSettingTab extends PluginSettingTab {
  plugin: AiFilenamePlugin;

  constructor(app: App, plugin: AiFilenamePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Ollama URL")
      .setDesc("Base URL of the local Ollama server.")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.ollamaUrl)
          .setValue(this.plugin.settings.ollamaUrl)
          .onChange(async (value) => {
            this.plugin.settings.ollamaUrl = value.trim() || DEFAULT_SETTINGS.ollamaUrl;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Ollama model")
      .setDesc("Model used to generate filenames (e.g. llama3.2, qwen2.5).")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.ollamaModel)
          .setValue(this.plugin.settings.ollamaModel)
          .onChange(async (value) => {
            this.plugin.settings.ollamaModel = value.trim() || DEFAULT_SETTINGS.ollamaModel;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Max slug length")
      .setDesc("Generated filenames are truncated to this many characters.")
      .addText((text) =>
        text
          .setPlaceholder(String(DEFAULT_SETTINGS.maxSlugLength))
          .setValue(String(this.plugin.settings.maxSlugLength))
          .onChange(async (value) => {
            const n = parseInt(value, 10);
            this.plugin.settings.maxSlugLength =
              Number.isFinite(n) && n > 0 ? n : DEFAULT_SETTINGS.maxSlugLength;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Draft prefix")
      .setDesc("Throwaway filenames for newly created auto-named notes start with this.")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.draftPrefix)
          .setValue(this.plugin.settings.draftPrefix)
          .onChange(async (value) => {
            this.plugin.settings.draftPrefix = value || DEFAULT_SETTINGS.draftPrefix;
            await this.plugin.saveSettings();
          })
      );
  }
}
