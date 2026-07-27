import { useFonts } from "expo-font";

export const fontFamilies = {
  serif: "PlayfairDisplay-Bold",
  sans: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
} as const;

export function useCustomFonts() {
  return useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "PlayfairDisplay-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
  });
}
