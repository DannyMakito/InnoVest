import { ScrollView, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EAEFEA" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Image
            source={images.innovestIconTree}
            style={{ width: 80, height: 80, marginBottom: 12 }}
            resizeMode="contain"
          />
          <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 30, color: "#333333" }}>
            InnoVest
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#666666", marginTop: 4 }}>
            Design System
          </Text>
        </View>

        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#333333", marginBottom: 12 }}>
          Colors
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {[
            { name: "Olive", bg: "#6B7220" },
            { name: "Gold", bg: "#D4AF37" },
            { name: "Sage", bg: "#EAEFEA" },
            { name: "Error", bg: "#EE2023" },
            { name: "Success", bg: "#EAE8BB" },
          ].map((c) => (
            <View key={c.name} style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  backgroundColor: c.bg,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  marginBottom: 4,
                }}
              />
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#333333" }}>
                {c.name}
              </Text>
            </View>
          ))}
        </View>

        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#333333", marginBottom: 12 }}>
          Typography
        </Text>
        <View style={{ gap: 8, marginBottom: 24 }}>
          <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 36, color: "#333333" }}>
            H1 Serif
          </Text>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 24, color: "#333333" }}>
            H2 Sans Bold
          </Text>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 18, color: "#333333" }}>
            Body SemiBold
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16, color: "#333333" }}>
            Body Regular
          </Text>
          <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14, color: "#333333" }}>
            Label Medium
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#666666" }}>
            Caption text
          </Text>
        </View>

        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#333333", marginBottom: 12 }}>
          Buttons
        </Text>
        <View style={{ gap: 12, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: "#6B7220",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#FFFFFF" }}>
              Primary Button
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: "#6B7220",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#6B7220" }}>
              Secondary Button
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#D4AF37",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#FFFFFF" }}>
              CTA Button
            </Text>
          </View>
        </View>

        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#333333", marginBottom: 12 }}>
          Cards
        </Text>
        <View
          style={{
            backgroundColor: "#6B7220",
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 14, color: "#EAEFEA", marginBottom: 4 }}>
            Balance Card
          </Text>
          <Text style={{ fontFamily: "Inter_700Bold", fontSize: 32, color: "#D4AF37" }}>
            R1,020.00
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16, color: "#333333" }}>
                Transaction Card
              </Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#666666", marginTop: 2 }}>
                Jan 12, 2023
              </Text>
            </View>
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#EE2023" }}>
              -R100
            </Text>
          </View>
        </View>

        <Text style={{ fontFamily: "Inter_700Bold", fontSize: 20, color: "#333333", marginBottom: 12 }}>
          Input Fields
        </Text>
        <View style={{ gap: 12, marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              padding: 14,
            }}
          >
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16, color: "#999999" }}>
              Placeholder
            </Text>
          </View>
          <View>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#EE2023",
                padding: 14,
              }}
            >
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16, color: "#999999" }}>
                Error field
              </Text>
            </View>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "#EE2023", marginTop: 4 }}>
              Error fields are placed here.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
