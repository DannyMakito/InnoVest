import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

export default function IdVerificationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFEF6" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 28,
        }}
      >
        <View className="flex-1">
          <View className="flex-row justify-center gap-1.5">
            <View className="h-1.5 flex-1 rounded-full bg-[#7FA080]" />
            <View className="h-1.5 flex-1 rounded-full bg-[#E5E7D9]" />
            <View className="h-1.5 flex-1 rounded-full bg-[#E5E7D9]" />
          </View>

          <Image
            source={images.innovestIconTree}
            resizeMode="contain"
            style={{ alignSelf: "center", height: 96, marginTop: 36, width: 100 }}
          />
          <Text className="text-center font-serif text-[30px] leading-[36px] text-primary">
            InnoVest
          </Text>

          <Text className="mt-8 text-center font-sans-bold text-[25px] leading-[31px] text-[#111111]">
            Complete FICA Verification
          </Text>
          <Text className="mt-2 text-center font-sans text-[15px] leading-[21px] text-[#111111]">
            For South African financial compliance (FICA), please provide your details. This goes
            to a human Admin for manual approval.
          </Text>

          <VerificationStep
            step="1. Take Photo of Your Green ID Document"
            note="(Smart ID or Passport)"
            type="document"
          />
          <VerificationStep step="2. Take a Liveness Selfie" type="selfie" />

          <Text className="mt-7 px-4 text-center font-sans text-[14px] leading-[20px] text-[#111111]">
            Approval is typically within 2 hours. You’ll receive a User ID (e.g., AB001) upon
            approval.
          </Text>

          <View className="flex-1" />

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => router.replace("/")}
            style={{
              alignItems: "center",
              backgroundColor: "#6B7220",
              borderRadius: 28,
              height: 54,
              justifyContent: "center",
              marginTop: 24,
            }}
          >
            <Text className="font-sans-bold text-[16px] tracking-[0.2px] text-white">
              SUBMIT FOR ADMIN REVIEW
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function VerificationStep({
  note,
  step,
  type,
}: {
  note?: string;
  step: string;
  type: "document" | "selfie";
}) {
  return (
    <View
      className="mt-5 flex-row items-center gap-5 rounded-[14px] bg-[#E4EBDD] px-4 py-4"
      style={{ minHeight: 118 }}
    >
      <View className="h-[88px] w-[112px] items-center justify-center rounded-lg bg-[#F9FAEF]">
        <View className="absolute left-2 top-2 h-7 w-7 rounded-tl-md border-l-[4px] border-t-[4px] border-[#4C7F61]" />
        <View className="absolute right-2 top-2 h-7 w-7 rounded-tr-md border-r-[4px] border-t-[4px] border-[#4C7F61]" />
        <View className="absolute bottom-2 left-2 h-7 w-7 rounded-bl-md border-b-[4px] border-l-[4px] border-[#4C7F61]" />
        <View className="absolute bottom-2 right-2 h-7 w-7 rounded-br-md border-b-[4px] border-r-[4px] border-[#4C7F61]" />

        {type === "document" ? (
          <View className="h-[46px] w-[76px] rounded-sm border border-[#BDC8AA] bg-white px-1.5 py-1">
            <View className="h-2 w-12 rounded-full bg-[#B84E47]" />
            <View className="mt-1 h-5 rounded-sm bg-[#DCE8D4]" />
            <Text className="mt-0.5 text-center font-sans-bold text-[8px] text-[#6B7220]">
              Align in Frame
            </Text>
          </View>
        ) : (
          <View className="h-[66px] w-[66px] items-center justify-center rounded-full border-2 border-[#6B7220] bg-[#EFE9D0]">
            <View className="h-7 w-7 rounded-full bg-[#CFAF83]" />
            <View className="mt-1 h-5 w-12 rounded-t-full bg-[#F9FAEF]" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text className="font-sans-bold text-[15px] leading-[20px] text-[#111111]">{step}</Text>
        {note ? <Text className="font-sans-bold text-[14px] leading-[19px] text-[#111111]">{note}</Text> : null}
      </View>
    </View>
  );
}
