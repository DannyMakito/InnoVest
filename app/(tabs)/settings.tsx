import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const menuItems = [
  { icon: "create-outline", label: "Edit Profile", screen: "edit-profile" },
  { icon: "settings-outline", label: "Account Settings", screen: "account-settings" },
  { icon: "notifications-outline", label: "Notification Preferences", screen: "notifications" },
  { icon: "shield-checkmark-outline", label: "Privacy & Security", screen: "privacy" },
  { icon: "help-circle-outline", label: "Help & Support", screen: "help" },
] as const;

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }} edges={["top"]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111111" }}>
          Profile
        </Text>
        <TouchableOpacity style={{ padding: 4 }}>
          <Ionicons name="ellipsis-vertical" size={20} color="#111111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
        <View style={{ alignItems: "center", marginBottom: 28 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#E0C892",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
              borderWidth: 3,
              borderColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 36, color: "#FFFFFF" }}>
              AS
            </Text>
          </View>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111111" }}>
            Ananya Sharma
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#666666", marginTop: 3 }}>
            ananya.sharma@email.com
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#D5DABF",
            overflow: "hidden",
          }}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 15,
                paddingHorizontal: 16,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "#F0F0F0",
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "#EEF2E4",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name={item.icon as any} size={20} color="#6B7220" />
              </View>
              <Text style={{ flex: 1, fontFamily: "Inter-Medium", fontSize: 15, color: "#333333" }}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLogout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
            paddingVertical: 14,
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#FECACA",
            gap: 8,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EE2023" />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#EE2023" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
