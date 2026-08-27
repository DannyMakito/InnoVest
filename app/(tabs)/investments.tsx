import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useInvestmentStore } from "@/store/investment-store";

const headerBg = "#2D3111";
const primary = "#6B7220";
const gold = "#D4AF37";
const cream = "#F4F7F0";

export default function InvestmentsScreen() {
  const router = useRouter();
  const {
    goals,
    fixedInvestments,
    getTotalSaved,
    getTotalFixedInvested,
    getTotalProjectedReturns,
    getActiveInvestmentsCount,
    setSelectedGoal,
  } = useInvestmentStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const totalSaved = getTotalSaved();
  const totalFixed = getTotalFixedInvested();
  const totalBalance = totalSaved + totalFixed;
  const activeCount = getActiveInvestmentsCount();

  const handleViewGoal = (goalId: string) => {
    setSelectedGoal(goalId);
    router.push("/investment-detail");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: cream }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="px-4 pt-1">
          <Header />
          <BalanceCard
            totalBalance={totalBalance}
            activeCount={activeCount}
            projectedReturns={getTotalProjectedReturns()}
            onAddMoney={() => setCreateModalVisible(true)}
          />
          <ActionButtons
            onAddInvestment={() => setCreateModalVisible(true)}
            onWithdraw={() => Alert.alert("Withdraw", "Withdraw feature coming soon")}
            onSettings={() => Alert.alert("Settings", "Investment settings coming soon")}
          />
          <InvestmentsList
            goals={goals}
            fixedInvestments={fixedInvestments}
            onViewGoal={handleViewGoal}
          />
        </View>
      </ScrollView>

      <CreateInvestmentModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="font-sans-bold text-[22px] text-neutral-900">
        Investments
      </Text>
      <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-olive-100">
        <Ionicons name="notifications-outline" size={20} color={primary} />
      </TouchableOpacity>
    </View>
  );
}

function BalanceCard({
  totalBalance,
  activeCount,
  projectedReturns,
  onAddMoney,
}: {
  totalBalance: number;
  activeCount: number;
  projectedReturns: number;
  onAddMoney: () => void;
}) {
  const formatAmount = (value: number) =>
    `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: headerBg }}
    >
      <View className="px-5 pb-5 pt-6">
        <Text className="font-sans text-[13px] text-white/70">
          Total Investment Balance
        </Text>
        <Text className="mt-1 font-serif text-[34px] text-white">
          {formatAmount(totalBalance)}
        </Text>

        <View className="mt-4 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-green-400" />
            <Text className="font-sans text-[12px] text-white/80">
              {activeCount} Active
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="trending-up" size={14} color="#4ADE80" />
            <Text className="font-sans text-[12px] text-white/80">
              {formatAmount(projectedReturns)} projected
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between bg-white/10 px-5 py-3">
        <Text className="font-sans text-[12px] text-white/60">
          Earn up to 9.5% p.a.
        </Text>
        <TouchableOpacity
          onPress={onAddMoney}
          activeOpacity={0.85}
          className="flex-row items-center gap-1.5 rounded-lg bg-gold-500 px-4 py-2"
        >
          <Ionicons name="add" size={16} color="#FFF" />
          <Text className="font-sans-bold text-[13px] text-white">
            Add Money
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ActionButtons({
  onAddInvestment,
  onWithdraw,
  onSettings,
}: {
  onAddInvestment: () => void;
  onWithdraw: () => void;
  onSettings: () => void;
}) {
  const buttons = [
    { icon: "add-circle-outline" as const, label: "Add", onPress: onAddInvestment },
    { icon: "arrow-down-circle-outline" as const, label: "Withdraw", onPress: onWithdraw },
    { icon: "settings-outline" as const, label: "Settings", onPress: onSettings },
    { icon: "ellipsis-horizontal" as const, label: "More", onPress: () => {} },
  ];

  return (
    <View className="mt-5 flex-row items-center justify-between px-2">
      {buttons.map((btn) => (
        <TouchableOpacity
          key={btn.label}
          activeOpacity={0.7}
          onPress={btn.onPress}
          className="items-center gap-1.5"
        >
          <View className="h-12 w-12 items-center justify-center rounded-full border border-olive-200 bg-white">
            <Ionicons name={btn.icon} size={22} color={primary} />
          </View>
          <Text className="font-sans-medium text-[11px] text-neutral-700">
            {btn.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function InvestmentsList({
  goals,
  fixedInvestments,
  onViewGoal,
}: {
  goals: any[];
  fixedInvestments: any[];
  onViewGoal: (id: string) => void;
}) {
  return (
    <View className="mt-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-sans-bold text-[17px] text-neutral-900">
          My Investments
        </Text>
        <TouchableOpacity>
          <Text className="font-sans-semibold text-[13px] text-primary">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <View className="gap-3">
        {goals.length === 0 &&
          fixedInvestments.filter((fi) => fi.status === "active").length === 0 && (
            <View className="items-center rounded-xl border border-dashed border-olive-200 bg-white p-8">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-olive-100">
                <Ionicons name="trending-up-outline" size={26} color={primary} />
              </View>
              <Text className="mt-3 font-sans-semibold text-[15px] text-neutral-900">
                No investments yet
              </Text>
              <Text className="mt-1 text-center font-sans text-[13px] text-neutral-500">
                Start a fixed investment or create a savings goal to begin growing your money
              </Text>
            </View>
          )}
        {goals.map((goal) => {
          const percentage = Math.min(
            Math.round((goal.savedAmount / goal.targetAmount) * 100),
            100
          );
          const deadlineDate = new Date(goal.deadline);
          const formattedDeadline = deadlineDate.toLocaleDateString("en-ZA", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <TouchableOpacity
              key={goal.id}
              activeOpacity={0.7}
              onPress={() => onViewGoal(goal.id)}
              className="rounded-xl border border-olive-200 bg-white p-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <View className="h-8 w-8 items-center justify-center rounded-lg bg-olive-100">
                      <Ionicons name="home" size={16} color={primary} />
                    </View>
                    <View>
                      <Text className="font-sans-semibold text-[14px] text-neutral-900">
                        {goal.name}
                      </Text>
                      <Text className="font-sans text-[11px] text-neutral-500">
                        Deadline: {formattedDeadline}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
              </View>

              <View className="mt-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-sans-bold text-[16px] text-neutral-900">
                    R{goal.savedAmount.toLocaleString()}
                  </Text>
                  <Text className="font-sans-semibold text-[12px] text-primary">
                    {percentage}%
                  </Text>
                </View>
                <View className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-olive-100">
                  <View
                    className="h-full rounded-full bg-gold-500"
                    style={{ width: `${percentage}%` }}
                  />
                </View>
                <View className="mt-1.5 flex-row items-center justify-between">
                  <Text className="font-sans text-[11px] text-neutral-500">
                    Target: R{goal.targetAmount.toLocaleString()}
                  </Text>
                  {goal.lockDate && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="lock-closed" size={10} color={gold} />
                      <Text className="font-sans text-[10px] text-gold-600">
                        Locked until {new Date(goal.lockDate).toLocaleDateString("en-ZA", { month: "short", year: "numeric" })}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {fixedInvestments
          .filter((fi) => fi.status === "active")
          .map((fi) => {
            const progress = Math.min(
              Math.round(
                ((new Date().getTime() - new Date(fi.startDate).getTime()) /
                  (new Date(fi.endDate).getTime() - new Date(fi.startDate).getTime())) *
                  100
              ),
              100
            );

            return (
              <View
                key={fi.id}
                className="rounded-xl border border-olive-200 bg-white p-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <View className="h-8 w-8 items-center justify-center rounded-lg bg-gold-100">
                        <Ionicons name="lock-closed" size={16} color={gold} />
                      </View>
                      <View>
                        <Text className="font-sans-semibold text-[14px] text-neutral-900">
                          {fi.name}
                        </Text>
                        <Text className="font-sans text-[11px] text-neutral-500">
                          {fi.term} months @ {fi.interestRate}% p.a.
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CCC" />
                </View>

                <View className="mt-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-sans-bold text-[16px] text-neutral-900">
                      R{fi.amount.toLocaleString()}
                    </Text>
                    <Text className="font-sans-semibold text-[12px] text-primary">
                      {progress}%
                    </Text>
                  </View>
                  <View className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-olive-100">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </View>
                  <View className="mt-1.5 flex-row items-center justify-between">
                    <Text className="font-sans text-[11px] text-neutral-500">
                      Matures: {new Date(fi.endDate).toLocaleDateString("en-ZA", { month: "short", year: "numeric" })}
                    </Text>
                    <Text className="font-sans text-[11px] text-neutral-500">
                      Returns: R{fi.projectedReturn.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
}

function CreateInvestmentModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { createGoal } = useInvestmentStore();
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [minInvestment, setMinInvestment] = useState("1000");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [lockDate, setLockDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showLockDatePicker, setShowLockDatePicker] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateISO = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleDeadlineChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDeadlinePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const handleLockDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowLockDatePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setLockDate(selectedDate);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter an investment name.");
      return;
    }
    const target = parseFloat(targetAmount);
    if (!target || target <= 0) {
      Alert.alert("Required", "Please enter a valid target amount.");
      return;
    }
    const min = parseFloat(minInvestment);
    if (!min || min <= 0) {
      Alert.alert("Required", "Please enter a valid minimum investment.");
      return;
    }
    if (!deadline) {
      Alert.alert("Required", "Please select a deadline date.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      createGoal(name.trim(), target, formatDateISO(deadline), min, lockDate ? formatDateISO(lockDate) : undefined);
      setLoading(false);
      setName("");
      setTargetAmount("");
      setMinInvestment("1000");
      setDeadline(null);
      setLockDate(null);
      onClose();
      Alert.alert("Success", "Investment created successfully!");
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            width: "90%",
            maxWidth: 380,
          }}
        >
          <Text className="text-center font-sans-bold text-[18px] text-neutral-900">
            Create Investment
          </Text>
          <Text className="mt-1 text-center font-sans text-[12px] text-neutral-500">
            Set up a new investment goal
          </Text>

          <View className="mt-5 gap-4">
            <View>
              <Text className="mb-1.5 font-sans-semibold text-[12px] text-neutral-700">
                Investment Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Apartment Fund"
                placeholderTextColor="#999"
                className="rounded-lg border border-olive-200 bg-olive-50 px-3.5 font-sans text-[14px] text-neutral-900"
                style={{ height: 44 }}
              />
            </View>

            <View>
              <Text className="mb-1.5 font-sans-semibold text-[12px] text-neutral-700">
                Target Amount (R)
              </Text>
              <TextInput
                value={targetAmount}
                onChangeText={setTargetAmount}
                placeholder="e.g., 500000"
                keyboardType="numeric"
                placeholderTextColor="#999"
                className="rounded-lg border border-olive-200 bg-olive-50 px-3.5 font-sans text-[14px] text-neutral-900"
                style={{ height: 44 }}
              />
            </View>

            <View>
              <Text className="mb-1.5 font-sans-semibold text-[12px] text-neutral-700">
                Minimum Investment (R)
              </Text>
              <TextInput
                value={minInvestment}
                onChangeText={setMinInvestment}
                placeholder="e.g., 1000"
                keyboardType="numeric"
                placeholderTextColor="#999"
                className="rounded-lg border border-olive-200 bg-olive-50 px-3.5 font-sans text-[14px] text-neutral-900"
                style={{ height: 44 }}
              />
            </View>

            <View>
              <Text className="mb-1.5 font-sans-semibold text-[12px] text-neutral-700">
                Deadline
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDeadlinePicker(true)}
                className="flex-row items-center justify-between rounded-lg border border-olive-200 bg-olive-50 px-3.5"
                style={{ height: 44 }}
              >
                <Text
                  className={`font-sans text-[14px] ${
                    deadline ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {deadline ? formatDate(deadline) : "Select deadline date"}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#6B7220" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="mb-1.5 font-sans-semibold text-[12px] text-neutral-700">
                Lock Date (optional)
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowLockDatePicker(true)}
                className="flex-row items-center justify-between rounded-lg border border-olive-200 bg-olive-50 px-3.5"
                style={{ height: 44 }}
              >
                <Text
                  className={`font-sans text-[14px] ${
                    lockDate ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {lockDate ? formatDate(lockDate) : "Select lock date"}
                </Text>
                <Ionicons name="lock-closed-outline" size={18} color="#D4AF37" />
              </TouchableOpacity>
              <Text className="mt-1 font-sans text-[10px] text-neutral-400">
                Funds locked until this date. No withdrawals allowed before.
              </Text>
            </View>
          </View>

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              className="h-11 flex-1 items-center justify-center rounded-lg border border-olive-200"
            >
              <Text className="font-sans-semibold text-[13px] text-neutral-600">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCreate}
              disabled={loading}
              className="h-11 flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-primary"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={16} color="#FFF" />
                  <Text className="font-sans-bold text-[13px] text-white">
                    Create
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>

      {showDeadlinePicker && (
        <DateTimePicker
          value={deadline || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={handleDeadlineChange}
        />
      )}

      {showLockDatePicker && (
        <DateTimePicker
          value={lockDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={handleLockDateChange}
        />
      )}

      {Platform.OS === "ios" && showDeadlinePicker && (
        <View className="flex-row justify-end bg-white px-4 pb-4">
          <TouchableOpacity
            onPress={() => setShowDeadlinePicker(false)}
            className="rounded-lg bg-primary px-4 py-2"
          >
            <Text className="font-sans-bold text-[13px] text-white">Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {Platform.OS === "ios" && showLockDatePicker && (
        <View className="flex-row justify-end bg-white px-4 pb-4">
          <TouchableOpacity
            onPress={() => setShowLockDatePicker(false)}
            className="rounded-lg bg-primary px-4 py-2"
          >
            <Text className="font-sans-bold text-[13px] text-white">Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
}
