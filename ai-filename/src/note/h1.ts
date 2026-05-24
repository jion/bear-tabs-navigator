import { App, TFile } from "obsidian";

export function readH1(app: App, file: TFile): string | null {
  const cache = app.metadataCache.getFileCache(file);
  if (!cache || !cache.headings) return null;
  const h1 = cache.headings.find((h) => h.level === 1);
  return h1 ? h1.heading : null;
}
