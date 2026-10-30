export type Selection = { type: "universe" | "tool" | "entity"; id: string } | null;

/**
 * Resolve an IMPACT hash route without allowing malformed percent-encoding
 * to crash the application during initial load or browser history navigation.
 */
export function parseSelectionHash(hash: string): Selection {
  const match = /^#(universe|tool|entity)\/(.+)$/.exec(hash);
  if (!match) return null;

  try {
    const id = decodeURIComponent(match[2]).trim();
    if (!id || /[\/\\\u0000-\u001f\u007f]/.test(id)) return null;
    return { type: match[1] as NonNullable<Selection>["type"], id };
  } catch {
    return null;
  }
}
