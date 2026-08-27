import { images } from "@/constants/images";
import { useAuth, useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();

  const handleLogin = async () => {
    if (!isLoaded) return;
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (signInError) {
        setError(signInError.longMessage || "Invalid email or password.");
        setLoading(false);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize();
        router.replace("/(tabs)/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
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
              paddingVertical: 30,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
            }}
          >
            <Text className="text-center font-serif text-[29px] leading-[34px] text-[#111111]">
              WELCOME BACK
            </Text>
            <Image
              source={images.innovestLogo}
              resizeMode="contain"
              style={{ alignSelf: "center", height: 86, marginTop: 14, width: 92 }}
            />

            <AuthInput
              label="Email Address"
              placeholder="Email Address"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <AuthInput
              label="Password"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? (
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#EE2023", marginTop: 8, textAlign: "center" }}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity activeOpacity={0.8} style={{ alignSelf: "flex-end", paddingTop: 8 }}>
              <Text className="font-sans text-[11px] leading-[15px] text-[#6B7220]">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.86}
              onPress={handleLogin}
              disabled={loading}
              style={{
                alignItems: "center",
                backgroundColor: loading ? "#D1D5DB" : "#6B7220",
                borderRadius: 7,
                height: 43,
                justifyContent: "center",
                marginTop: 18,
              }}
            >
              <Text className="font-sans-bold text-[13px] tracking-[0.5px] text-white">
                {loading ? "Logging in..." : "LOG IN"}
              </Text>
            </TouchableOpacity>

            <Text className="mt-24 text-center font-sans text-[12px] leading-[16px] text-[#333333]">
              Don{"'"}t have an account?{" "}
              <Link href="/sign-up" className="font-sans-semibold text-[#111111]">
                Sign up.
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthInputProps = {
  label: string;
  placeholder: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  value?: string;
};

function AuthInput({
  label,
  placeholder,
  autoCapitalize,
  keyboardType = "default",
  onChangeText,
  secureTextEntry,
  value,
}: AuthInputProps) {
  return (
    <View className="mt-4">
      <Text className="mb-1 font-sans-semibold text-[13px] leading-[17px] text-[#111111]">
        {label}
      </Text>
      <View>
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#777777"
          secureTextEntry={secureTextEntry}
          value={value}
          style={{
            borderColor: "#333333",
            borderRadius: 5,
            borderWidth: 1,
            color: "#111111",
            fontFamily: "Inter-Regular",
            fontSize: 14,
            height: 39,
            paddingHorizontal: 10,
            paddingRight: secureTextEntry ? 36 : 10,
          }}
        />
        {secureTextEntry ? (
          <Text className="absolute right-3 top-[9px] font-sans-bold text-[13px] text-[#333333]">
            ⊘
          </Text>
        ) : null}
      </View>
    </View>
  );
}
