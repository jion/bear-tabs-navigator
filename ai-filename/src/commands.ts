import { MarkdownView, Notice } from "obsidian";
import type AiFilenamePlugin from "./main";
import { createDraftNote } from "./note/draft";
import { generateFilenameForFile } from "./filename/generator";

export function registerCommands(plugin: AiFilenamePlugin): void {
  plugin.addCommand({
    id: "new-auto-named-note",
    name: "New auto-named note",
    callback: async () => {
      const file = await createDraftNote(plugin.app, plugin.settings.draftPrefix);
      const leaf = plugin.app.workspace.getLeaf(false);
      await leaf.openFile(file);
    },
  });

  plugin.addCommand({
    id: "generate-filename-from-content",
    name: "Generate filename from content",
    checkCallback: (checking: boolean) => {
      const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
      const file = view?.file;
      if (!file) return false;
      if (checking) return true;
      generateFilenameForFile(plugin.app, file, plugin.settings).catch((e) => {
        new Notice(`Failed: ${e instanceof Error ? e.message : String(e)}`);
      });
      return true;
    },
  });
}
