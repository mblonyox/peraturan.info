export const themeOptions = [
  "light",
  "dark",
  "retro",
  "cyberpunk",
  "valentine",
  "aqua",
] as const;

export type ThemeOption = typeof themeOptions[number];

export const isValidTheme = (t: string): t is ThemeOption =>
  themeOptions.includes(t as ThemeOption);
