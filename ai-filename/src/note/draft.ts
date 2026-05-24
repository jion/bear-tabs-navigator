import { App, TFile } from "obsidian";

export async function createDraftNote(app: App, draftPrefix: string): Promise<TFile> {
  const ts = Date.now();
  const folder = app.fileManager.getNewFileParent("");
  const dir = folder ? folder.path : "";
  const name = `${draftPrefix}${ts}.md`;
  const path = dir ? `${dir}/${name}` : name;
  return await app.vault.create(path, "# \n\n");
}
