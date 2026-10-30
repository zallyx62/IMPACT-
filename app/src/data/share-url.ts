export function buildDossierShareUrl(currentUrl: string, entityId: string): string {
  const url = new URL(currentUrl);
  url.hash = `entity/${encodeURIComponent(entityId)}`;
  return url.toString();
}
