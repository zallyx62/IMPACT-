export type Selection = { type: "universe" | "tool" | "entity"; id: string } | null;

/**
 * Parse an IMPACT hash route defensively.
 * Invalid route types, empty identifiers and malformed URI sequences are ignored.
 */
export function parseSelectionHash(hash: string): Selection {
  const match = /^#(universe|tool|entity)\/(.+)$/.exec(hash);
  if (!match) return null;

  try {
    const id = decodeURIComponent(match[2]).trim();
    return id ? { type: match[1] as NonNullable<Selection>["type"], id } : null;
  } catch {
    return null;
  }
}
