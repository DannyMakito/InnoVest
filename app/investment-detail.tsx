import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useInvestmentStore } from "@/store/investment-store";
import { images } from "@/constants/images";

const headerBg = "#2D3111";
const gold = "#D4AF37";
const cream = "#F4F7F0";

export default function InvestmentDetailScreen() {
  const router = useRouter();
  const {
    goals,
    selectedGoalId,
    getGoalContributions,
    contributeToGoal,
    automaticDeductionEnabled,
    toggleAutomaticDeduction,
    withdrawFromGoal,
  } = useInvestmentStore();

  const goal = goals.find((g) => g.id === selectedGoalId);
  const contributions = goal ? getGoalContributions(goal.id) : [];

  if (!goal) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: cream }}>
        <View className="flex-1 items-center justify-center">
          <Text className="font-sans text-[14px] text-neutral-500">
            No investment selected
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 rounded-lg bg-primary px-6 py-3"
          >
            <Text className="font-sans-bold text-[14px] text-white">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cream }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <GoalHeader goal={goal} onBack={() => router.back()} />
        <View className="px-4">
          <ProgressBar goal={goal} />
          <StatsRow goal={goal} />
          <ActionButtons
            goalId={goal.id}
            goal={goal}
            enabled={automaticDeductionEnabled[goal.id]}
            onToggleDeduction={() => toggleAutomaticDeduction(goal.id)}
          />
          <CustomContribution goal={goal} />
          <GoalHistory contributions={contributions} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function GoalHeader({
  goal,
  onBack,
}: {
  goal: any;
  onBack: () => void;
}) {
  return (
    <View
      className="items-center"
      style={{ backgroundColor: headerBg, paddingTop: 12, paddingBottom: 24 }}
    >
      <View className="mb-3 flex-row w-full items-center px-4">
        <TouchableOpacity
          onPress={onBack}
          className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
        >
          <Ionicons name="chevron-back" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text className="mx-auto font-sans-bold text-[16px] text-white">
          Investment Detail
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <Image
        source={images.innovestLogo}
        resizeMode="contain"
        style={{ height: 32, width: 32, marginBottom: 8 }}
      />
      <Text className="font-sans-bold text-[20px] text-white">
        {goal.name}
      </Text>

      <View
        className="mt-4 items-center justify-center"
        style={{
          width: 100,
          height: 100,
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Ionicons name="home" size={48} color={gold} />
      </View>
    </View>
  );
}

function ProgressBar({ goal }: { goal: any }) {
  const percentage = Math.min(
    Math.round((goal.savedAmount / goal.targetAmount) * 100),
    100
  );

  return (
    <View style={{ marginTop: -16 }}>
      <View
        className="rounded-xl bg-white p-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View className="h-[14px] overflow-hidden rounded-full bg-olive-100">
          <View
            className="h-full rounded-full bg-gold-500"
            style={{ width: `${percentage}%` }}
          />
        </View>

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="font-sans-semibold text-[13px] text-neutral-900">
            R{goal.savedAmount.toLocaleString()} Saved of R
            {goal.targetAmount.toLocaleString()} Target
          </Text>
          <Text className="font-sans-bold text-[13px] text-primary">
            {percentage}%
          </Text>
        </View>

        <Text className="mt-1 font-sans text-[12px] text-neutral-600">
          R{goal.minInvestment.toLocaleString()} min. Investment
        </Text>
      </View>
    </View>
  );
}

function StatsRow({ goal }: { goal: any }) {
  const deadlineDate = new Date(goal.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString("en-ZA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View
      className="mt-4 flex-row items-center justify-between rounded-xl bg-white px-3 py-3.5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <StatItem
        label="Target"
        value={`R${goal.targetAmount.toLocaleString()}`}
      />
      <View className="mx-2 h-8 w-px bg-neutral-200" />
      <StatItem
        label="Saved"
        value={`R${goal.savedAmount.toLocaleString()}`}
      />
      <View className="mx-2 h-8 w-px bg-neutral-200" />
      <StatItem label="Goal Deadline" value={formattedDeadline} />
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="font-sans-medium text-[11px] text-neutral-500">
        {label}
      </Text>
      <Text className="mt-1 font-sans-bold text-[13px] text-neutral-900">
        {value}
      </Text>
    </View>
  );
}

function ActionButtons({
  goalId,
  goal,
  enabled,
  onToggleDeduction,
}: {
  goalId: string;
  goal: any;
  enabled: boolean;
  onToggleDeduction: () => void;
}) {
  const [investing, setInvesting] = useState(false);
  const { contributeToGoal } = useInvestmentStore();

  const handleInvest = () => {
    setInvesting(true);
    setTimeout(() => {
      contributeToGoal(goalId, goal.minInvestment);
      setInvesting(false);
      Alert.alert("Investment", "Investment processed successfully!");
    }, 2000);
  };

  return (
    <View className="mt-4 flex-row gap-2.5">
      <TouchableOpacity
        onPress={handleInvest}
        disabled={investing}
        activeOpacity={0.85}
        className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-gold-500"
        style={{ height: 46 }}
      >
        {investing ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Ionicons name="wallet-outline" size={18} color="#FFF" />
        )}
        <Text className="font-sans-bold text-[13px] text-white">
          {investing ? "Processing..." : "Invest Saved Funds"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onToggleDeduction}
        activeOpacity={0.85}
        className="flex-1 flex-row items-center justify-center gap-1.5 rounded-lg border-[1.5px]"
        style={{
          height: 46,
          backgroundColor: "transparent",
          borderColor: enabled ? "#6B7220" : gold,
        }}
      >
        <Ionicons
          name={enabled ? "checkmark-circle" : "repeat-outline"}
          size={18}
          color={enabled ? "#6B7220" : gold}
        />
        <Text
          className="font-sans-bold text-[13px]"
          style={{ color: enabled ? "#6B7220" : gold }}
        >
          Automatic Deduction
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function CustomContribution({ goal }: { goal: any }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { contributeToGoal } = useInvestmentStore();

  const handleContribute = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid contribution amount.");
      return;
    }
    if (num < goal.minInvestment) {
      Alert.alert(
        "Below Minimum",
        `Minimum investment is R${goal.minInvestment.toLocaleString()}`
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      contributeToGoal(goal.id, num);
      setLoading(false);
      setAmount("");
      Alert.alert("Success", `R${num.toLocaleString()} contributed successfully!`);
    }, 2000);
  };

  return (
    <View className="mt-5">
      <Text className="font-sans-bold text-[15px] text-neutral-900">
        Custom Contribution
      </Text>
      <View className="mt-2.5 flex-row gap-2.5">
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter Contribution Amount"
          keyboardType="numeric"
          placeholderTextColor="#999"
          className="flex-1 rounded-lg border border-olive-200 bg-olive-50 px-3.5 font-sans text-[14px] text-neutral-900"
          style={{ height: 46 }}
        />
        <TouchableOpacity
          onPress={handleContribute}
          disabled={loading}
          activeOpacity={0.85}
          className="items-center justify-center rounded-lg bg-primary px-5"
          style={{ height: 46 }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text className="font-sans-bold text-[14px] text-white">
              Confirm
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function GoalHistory({ contributions }: { contributions: any[] }) {
  return (
    <View className="mt-6">
      <Text className="font-sans-bold text-[15px] text-neutral-900">
        Goal History
      </Text>

      {contributions.length === 0 ? (
        <View className="mt-3 items-center rounded-xl bg-white py-5">
          <Ionicons name="document-text-outline" size={36} color="#CCC" />
          <Text className="mt-2 font-sans text-[13px] text-neutral-400">
            No contributions yet
          </Text>
        </View>
      ) : (
        <View className="mt-3 gap-2">
          {contributions.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center rounded-xl bg-white px-3.5 py-3.5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <View
                className="mr-3 items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor:
                    item.type === "automatic" ? "#EEF2E4" : "#FDF8E8",
                }}
              >
                <Ionicons
                  name={
                    item.type === "automatic"
                      ? "repeat"
                      : item.type === "dividend"
                      ? "trending-up"
                      : "cash"
                  }
                  size={18}
                  color={item.type === "automatic" ? "#6B7220" : gold}
                />
              </View>

              <View className="flex-1">
                <Text className="font-sans-semibold text-[13px] text-neutral-900">
                  Contribution
                </Text>
                <Text className="mt-0.5 font-sans text-[11px] text-neutral-400">
                  {item.reference}
                </Text>
              </View>

              <Text className="font-sans-bold text-[14px] text-neutral-900">
                + R{item.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
