import { Redirect, useLocalSearchParams } from "expo-router";

export default function Index() {
  const { verified } = useLocalSearchParams<{ verified?: string }>();

  if (verified === "1") {
    return <Redirect href="/dashboard" />;
  }

  return <Redirect href="/onboarding" />;
}
