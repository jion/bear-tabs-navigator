import { OllamaProvider } from "./ollama";
import type { LlmProvider } from "./provider";
import type { AiFilenameSettings } from "../settings";

export function getProvider(settings: AiFilenameSettings): LlmProvider {
  return new OllamaProvider(settings.ollamaUrl, settings.ollamaModel);
}
