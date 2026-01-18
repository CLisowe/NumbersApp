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
    dot: "#1F2326",
    favorite: "#F4B400",     
    favoriteMuted: "#9CA3AF",
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
    dot: "#F6F7F8",
    favorite: "#FACC15",      
    favoriteMuted: "#6B7280",
  },
};

export type ThemeName = keyof typeof Colors; 
export type ThemeColors = typeof Colors.light;


export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ThemeColors
) {
  const theme = useColorScheme() ?? "light";
  const override = props[theme];
  return override ?? Colors[theme][colorName];
}


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
