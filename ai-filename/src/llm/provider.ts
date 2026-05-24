export interface LlmProvider {
  generateSlug(content: string): Promise<string>;
}
