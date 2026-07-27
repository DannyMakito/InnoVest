import { colors } from "./colors";

export const typography = {
  fontFamily: {
    serif: "PlayfairDisplay-Bold",
    sans: "Inter-Regular",
    sansMedium: "Inter-Medium",
    sansSemiBold: "Inter-SemiBold",
    sansBold: "Inter-Bold",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    "2xl": 30,
    "3xl": 36,
    "4xl": 48,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const layout = {
  screenPaddingHorizontal: spacing[5],
  sectionGap: spacing[6],
  cardPadding: spacing[5],
  inputHeight: 52,
  buttonHeight: 52,
  buttonHeightSm: 44,
  tabBarHeight: 70,
  headerHeight: 56,
} as const;

export const theme = {
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  colors,
} as const;

export default theme;
