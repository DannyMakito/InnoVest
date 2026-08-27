import { useAuth } from "@clerk/expo";
import { Redirect, useLocalSearchParams } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { verified } = useLocalSearchParams<{ verified?: string }>();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F4F7F0" }}>
        <ActivityIndicator size="large" color="#6B7220" />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  if (verified === "1") {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/onboarding" />;
}
