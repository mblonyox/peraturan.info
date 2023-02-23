export const ellipsis = (text: string, maxLength = 80) => {
  const subtext = text.trimEnd().substring(0, maxLength);
  const index = subtext.lastIndexOf(" ");
  return subtext.substring(0, index) + (text.length > maxLength ? "…" : "");
};
