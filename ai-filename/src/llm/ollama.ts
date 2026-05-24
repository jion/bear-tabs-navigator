import { requestUrl } from "obsidian";
import type { LlmProvider } from "./provider";

const SYSTEM_PROMPT =
  "You generate filenames. Reply with ONLY a short kebab-case slug summarizing the note: " +
  "2 to 6 words, lowercase, hyphen-separated, no extension, no path, no quotes, no explanation.";

const MAX_INPUT_CHARS = 1500;

export class OllamaProvider implements LlmProvider {
  constructor(
    private readonly url: string,
    private readonly model: string
  ) {}

  async generateSlug(content: string): Promise<string> {
    const body = {
      model: this.model,
      prompt: `${SYSTEM_PROMPT}\n\nNote:\n${content.slice(0, MAX_INPUT_CHARS)}`,
      stream: false,
      options: { temperature: 0.2 },
    };

    const res = await requestUrl({
      url: `${this.url.replace(/\/$/, "")}/api/generate`,
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify(body),
      throw: false,
    });

    if (res.status < 200 || res.status >= 300) {
      throw new Error(`HTTP ${res.status}`);
    }

    const raw: string = (res.json && res.json.response) || "";
    return raw.trim();
  }
}
