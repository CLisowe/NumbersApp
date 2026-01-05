import { useColorScheme } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
};

export const FontSize = {
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    card: "#F6F7F8",
    border: "#E3E5E8",
    tint: tintColorLight,
    icon: "#687076",
    danger: "#D92D20",
    success: "#039855",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    card: "#1F2326",
    border: "#2B3137",
    tint: tintColorDark,
    icon: "#9BA1A6",
    danger: "#F97066",
    success: "#32D583",
  },
};

export type ThemeName = keyof typeof Colors; // "light" | "dark"
export type ThemeColors = typeof Colors.light;

/**
 * Use when you want a single color value that adapts to light/dark.
 * Example: color: useThemeColor({}, "text")
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ThemeColors
) {
  const theme = useColorScheme() ?? "light";
  const override = props[theme];
  return override ?? Colors[theme][colorName];
}

/**
 * Use when you want the whole theme object.
 * Example: const { colors, spacing } = useAppTheme()
 */
export function useAppTheme() {
  const theme = useColorScheme() ?? "light";
  return {
    theme,
    colors: Colors[theme],
    spacing: Spacing,
    radius: Radius,
    fontSize: FontSize,
  };
}
