export function parseSrc(src: string) {
  const match = src.match(/^([\w-.]+)\/([\w-.]+)(?:#(.+))?$/);
  if (!match) throw new Error(`Invalid src: ${src}`);
  const [, owner, repo, ref] = match;
  const branch = ref ?? "main";
  return `https://raw.githubusercontent.com/${owner}/${repo}/refs/head/${branch}/`;
}
