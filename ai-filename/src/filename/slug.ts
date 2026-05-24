export function sanitizeSlug(raw: string, maxLength: number): string {
  let slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-+$/g, "");
  }
  return slug;
}
