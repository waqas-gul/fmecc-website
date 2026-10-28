// three.js needs literal colours, so this mirrors src/shared/styles/tokens.css. Only the approved
// anchors and their steps appear here (planning/DESIGN.md §2.2): no other hues in 3D either.
export const palette = {
  navy950: "#070b14",
  navy900: "#0b1220",
  navy800: "#121c33",
  navy700: "#1a2749",
  blue600: "#1246d8",
  blue500: "#2e5be8",
  blue300: "#8fb0ff",
  blue100: "#dce6ff",
  cyan500: "#13c9d7",
  cyan300: "#7fe3ec",
  purple500: "#8b25e8",
  neutral700: "#4b5262",
  neutral500: "#6b7281",
  neutral400: "#8a94ab",
  neutral300: "#c7cdd8",
  neutral200: "#dfe3ea",
  neutral100: "#f1f3f7",
  white: "#ffffff",
} as const;
