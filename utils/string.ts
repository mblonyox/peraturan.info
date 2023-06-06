export const ellipsis = (text: string, maxLength = 80) => {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const subtext = trimmed.substring(0, maxLength);
  const index = subtext.lastIndexOf(" ");
  return subtext.substring(0, index) +
    (trimmed.length > maxLength ? "…" : "");
};
