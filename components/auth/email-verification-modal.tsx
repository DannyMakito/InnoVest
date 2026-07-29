import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type EmailVerificationModalProps = {
  email: string;
  visible: boolean;
  onComplete: () => void;
  onClose: () => void;
};

const codeLength = 6;

export function EmailVerificationModal({
  email,
  visible,
  onComplete,
  onClose,
}: EmailVerificationModalProps) {
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const maskedEmail = email.trim() || "your registered email";

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (digit && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === codeLength - 1 && nextCode.every(Boolean)) {
      setTimeout(onComplete, 250);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.38)",
          flex: 1,
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFEF6",
            borderRadius: 26,
            paddingHorizontal: 22,
            paddingVertical: 28,
          }}
        >
          <Text className="text-center font-sans-bold text-[25px] leading-[31px] text-[#111111]">
            Verify Your Email
          </Text>
          <Text className="mt-4 text-center font-sans text-[14px] leading-[20px] text-[#111111]">
            We’ve sent a 6-digit verification code to {maskedEmail}. Enter it below to continue.
          </Text>

          <View className="mt-9 flex-row justify-center gap-2">
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
                  borderColor: digit ? "#6B7220" : "#BABFAE",
                  borderRadius: 8,
                  borderWidth: 1,
                  color: "#111111",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 22,
                  height: 46,
                  textAlign: "center",
                  width: 42,
                }}
              />
            ))}
          </View>

          <Text className="mt-12 text-center font-sans text-[14px] leading-[20px] text-[#6B7220]">
            Resend Code <Text className="text-[#999999]">in 45s</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={onClose}
            style={{
              alignItems: "center",
              alignSelf: "center",
              marginTop: 18,
              padding: 8,
            }}
          >
            <Text className="font-sans-semibold text-[13px] text-[#666666]">Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
