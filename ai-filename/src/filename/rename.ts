import { App, TFile } from "obsidian";

export async function renameWithCollisionSuffix(
  app: App,
  file: TFile,
  desiredBaseName: string
): Promise<string> {
  const dir = file.parent ? file.parent.path : "";
  const ext = file.extension || "md";

  let candidate = desiredBaseName;
  let n = 2;
  while (true) {
    const candidatePath = joinPath(dir, `${candidate}.${ext}`);
    if (candidatePath === file.path) return candidate;
    if (!fileExists(app, candidatePath)) break;
    candidate = `${desiredBaseName}-${n}`;
    n += 1;
  }

  const newPath = joinPath(dir, `${candidate}.${ext}`);
  await app.fileManager.renameFile(file, newPath);
  return candidate;
}

function joinPath(dir: string, name: string): string {
  return dir ? `${dir}/${name}` : name;
}

function fileExists(app: App, path: string): boolean {
  return app.vault.getAbstractFileByPath(path) != null;
}
