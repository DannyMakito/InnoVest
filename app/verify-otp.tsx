import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const codeLength = 6;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email: emailParam } = router.params || { email: "" };
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (digit && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === codeLength - 1 && nextCode.every(Boolean)) {
      setTimeout(() => {
        router.replace("/id-verification");
      }, 250);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskedEmail = emailParam || "your registered email";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 28 }}>
          <View style={{ alignItems: "center", marginBottom: 36 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#EEF2E4",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#6B7220",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#FFFFFF" }}>✓</Text>
              </View>
            </View>

            <Text style={{ fontFamily: "Inter-Bold", fontSize: 22, color: "#111111", textAlign: "center" }}>
              Verify Your Email
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#666666", textAlign: "center", marginTop: 8, lineHeight: 20 }}>
              We've sent a 6-digit verification code to{"\n"}
              {maskedEmail}
            </Text>
          </View>

          <View className="flex-row justify-center gap-2">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(input) => {
                  inputRefs.current[index] = input;
                }}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={1}
                autoFocus={index === 0}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: digit ? "#6B7220" : "#D5DABF",
                  borderRadius: 8,
                  borderWidth: 1,
                  color: "#111111",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 22,
                  height: 48,
                  textAlign: "center",
                  width: 50,
                }}
              />
            ))}
          </View>

          <View style={{ alignItems: "center", marginTop: 32, gap: 16 }}>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#6B7220" }}>
                Resend Code <Text style={{ fontFamily: "Inter-Regular", color: "#999999" }}>in 45s</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#999999" }}>
                Didn't receive the code? Try another email
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
