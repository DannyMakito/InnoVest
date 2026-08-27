import { useAuth, useSignUp } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
const RESEND_SECONDS = 45;

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { signUp } = useSignUp();
  const { isLoaded } = useAuth();
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setCanResend(false);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [countdown]);

  const handleChange = async (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (digit && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (digit && index === codeLength - 1 && nextCode.every(Boolean)) {
      const fullCode = nextCode.join("");
      setVerifying(true);
      setError("");

      try {
        const { error: verifyError } = await signUp.verifications.verifyEmailCode({
          code: fullCode,
        });

        if (verifyError) {
          setError("Invalid code. Please check and try again.");
          setCode(Array(codeLength).fill(""));
          inputRefs.current[0]?.focus();
          setVerifying(false);
          return;
        }

        // Verification succeeded — finalize the session
        await signUp.finalize();

        // Navigate to the ID verification screen
        router.replace("/id-verification");
      } catch {
        setError("Something went wrong. Please try again.");
        setCode(Array(codeLength).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !isLoaded) return;
    setError("");
    setCountdown(RESEND_SECONDS);

    try {
      await signUp.verifications.sendEmailCode();
    } catch {
      // Silent — user can try again after countdown
    }
  };

  const maskedEmail = email || "your registered email";

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
              We{"'"}ve sent a 6-digit verification code to{"\n"}
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
                editable={!verifying}
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
                  opacity: verifying ? 0.6 : 1,
                }}
              />
            ))}
          </View>

          {error ? (
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#EE2023", marginTop: 16, textAlign: "center" }}>
              {error}
            </Text>
          ) : null}

          {verifying && (
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#6B7220", marginTop: 16, textAlign: "center" }}>
              Verifying code...
            </Text>
          )}

          <View style={{ alignItems: "center", marginTop: 32, gap: 16 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleResendCode}
              disabled={!canResend}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: canResend ? "#6B7220" : "#999999" }}>
                Resend Code{" "}
                {!canResend && (
                  <Text style={{ fontFamily: "Inter-Regular", color: "#999999" }}>
                    in {countdown}s
                  </Text>
                )}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#999999" }}>
                Didn{"'"}t receive the code? Try another email
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
