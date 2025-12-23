export function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}
