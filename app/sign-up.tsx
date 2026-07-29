import { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmailVerificationModal } from "@/components/auth/email-verification-modal";
import { images } from "@/constants/images";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [verificationVisible, setVerificationVisible] = useState(false);

  const completeVerification = () => {
    setVerificationVisible(false);
    router.replace("/id-verification");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 28,
            paddingVertical: 28,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
              paddingHorizontal: 20,
              paddingVertical: 26,
              shadowColor: "#ffffff",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text className="text-center font-serif text-[29px] leading-[34px] text-[#111111]">
              JOIN INNOVEST
            </Text>
            <Image
              source={images.innovestLogo}
              resizeMode="contain"
              style={{ alignSelf: "center", height: 78, marginTop: 8, width: 82 }}
            />

            <AuthInput label="Full Name" placeholder="Your full legal name" />
            <AuthInput
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <AuthInput
              label="Password"
              placeholder="Create a secure password"
              secureTextEntry
              hasError
            />
            <AuthInput
              label="Phone Number"
              placeholder="Your mobile phone number"
              keyboardType="phone-pad"
            />

            <View className="mt-3 flex-row items-center gap-2">
              <View
                style={{
                  borderColor: "#6B7220",
                  borderRadius: 2,
                  borderWidth: 1,
                  height: 15,
                  width: 15,
                }}
              />
              <Text className="font-sans text-[11px] leading-[14px] text-[#333333]">
                I agree to T&Cs and FICA compliance.
              </Text>
            </View>

            <PrimaryButton label="CREATE ACCOUNT" onPress={() => setVerificationVisible(true)} />

            <Text className="mt-5 text-center font-sans text-[12px] leading-[16px] text-[#333333]">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-sans-semibold text-[#111111]">
                Login.
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <EmailVerificationModal
        email={email}
        visible={verificationVisible}
        onClose={() => setVerificationVisible(false)}
        onComplete={completeVerification}
      />
    </SafeAreaView>
  );
}

type AuthInputProps = {
  label: string;
  placeholder: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  hasError?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  value?: string;
};

function AuthInput({
  label,
  placeholder,
  autoCapitalize,
  hasError,
  keyboardType = "default",
  onChangeText,
  secureTextEntry,
  value,
}: AuthInputProps) {
  return (
    <View className="mt-3">
      <Text className="mb-1.5 font-sans-semibold text-[13px] leading-[17px] text-[#111111]">
        {label}
      </Text>
      <View style={{ justifyContent: "center" }}>
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#777777"
          secureTextEntry={secureTextEntry}
          value={value}
          textAlignVertical="center"
          style={{
            borderColor: hasError ? "#B34A4A" : "#6B7220",
            borderRadius: 6,
            borderWidth: 1,
            color: "#111111",
            fontFamily: "Inter-Regular",
            fontSize: 15,
            height: 48,
            paddingHorizontal: 14,
            paddingVertical: 10,
            paddingRight: secureTextEntry ? 40 : 14,
          }}
        />
        {secureTextEntry ? (
          <View style={{ position: "absolute", right: 14 }}>
            <Text className="font-sans-bold text-[14px] text-[#8F3232]">
              ⊘
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={{
        alignItems: "center",
        backgroundColor: "#6B7220",
        borderRadius: 7,
        height: 48,
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <Text className="font-sans-bold text-[13px] tracking-[0.5px] text-white">{label}</Text>
    </TouchableOpacity>
  );
}
