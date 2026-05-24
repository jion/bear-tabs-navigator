import { App, Notice, TFile } from "obsidian";
import { getProvider } from "../llm/registry";
import { sanitizeSlug } from "./slug";
import { renameWithCollisionSuffix } from "./rename";
import { readH1 } from "../note/h1";
import type { AiFilenameSettings } from "../settings";

export async function generateFilenameForFile(
  app: App,
  file: TFile,
  settings: AiFilenameSettings
): Promise<void> {
  const content = await app.vault.read(file);
  const h1 = readH1(app, file);
  const source = h1 ? `# ${h1}\n\n${content}` : content;

  if (source.trim().length === 0) {
    new Notice("Note is empty — nothing to generate from.");
    return;
  }

  let raw: string;
  try {
    raw = await getProvider(settings).generateSlug(source);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    new Notice(`Could not reach Ollama at ${settings.ollamaUrl}: ${msg}`);
    return;
  }

  const slug = sanitizeSlug(raw, settings.maxSlugLength);
  if (!slug) {
    new Notice(`AI returned an unusable slug: "${raw}"`);
    return;
  }

  const ext = file.extension;
  const finalName = await renameWithCollisionSuffix(app, file, slug);
  new Notice(`Renamed to ${finalName}.${ext}`);
}
