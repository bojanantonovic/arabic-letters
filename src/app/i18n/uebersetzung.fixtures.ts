/** Ein Speicher im Arbeitsspeicher, damit Tests einander nicht stören. */
export function speicherAttrappe(inhalt: Record<string, string> = {}): Storage {
  const werte = new Map(Object.entries(inhalt));
  return {
    get length() {
      return werte.size;
    },
    clear: () => werte.clear(),
    getItem: (name) => werte.get(name) ?? null,
    key: (stelle) => [...werte.keys()][stelle] ?? null,
    removeItem: (name) => void werte.delete(name),
    setItem: (name, wert) => void werte.set(name, wert),
  };
}
