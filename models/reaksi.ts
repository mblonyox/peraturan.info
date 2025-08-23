export const getReaksi = async (kv: Deno.Kv, path: string) => {
  const entries = kv.list({ prefix: ["reactions", path] });
  const map = new Map<string, number>();
  for await (const { value } of entries) {
    map.set(value as string, (map.get(value as string) ?? 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
};

export const setReaksi = (
  kv: Deno.Kv,
  path: string,
  id: string,
  emoji: string,
) => kv.set(["reactions", path, id], emoji);
