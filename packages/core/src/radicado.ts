export function normalizeRadicado(value: string): string {
  return value.replace(/\D/g, "");
}

export function isLikelyRadicado(value: string): boolean {
  const normalized = normalizeRadicado(value);

  return normalized.length >= 20 && normalized.length <= 30;
}
