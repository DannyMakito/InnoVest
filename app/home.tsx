import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { images } from "@/constants/images";
import { useWalletStore } from "@/store/wallet-store";
import { useInvestmentStore } from "@/store/investment-store";
import { useGroupsStore, currentUser, syncCurrentUser } from "@/store/groups-store";
import { Transaction } from "@/types/wallet";
import { InvestmentGoal } from "@/types/investment";
import { GroupMember } from "@/types/groups";
import { useUser } from "@clerk/expo";

const getInitials = (fullName?: string | null, email?: string | null) => {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return "IV";
};

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const fullName = user.fullName || user.firstName || "You";
      const initials = getInitials(fullName, email);
      syncCurrentUser(user.id, fullName, initials);
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 18 }}
      >
        <View className="px-4 pt-1">
          <Header />
          <NetWorthCard />
          <ProductGrid />
          <RecentActivity />
          <GroupActivity />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const fullName = user?.fullName || user?.firstName;
  const initials = getInitials(fullName, email);

  return (
    <View className="mb-1 flex-row items-center justify-between">
      <View className="w-[54px] items-start">
        <Image source={images.innovestLogo} resizeMode="contain" style={{ height: 36, width: 36 }} />
      </View>

      <Text className="font-sans-bold text-[14px] leading-[18px] tracking-[0.2px] text-[#111111]">
        HI, {user?.firstName?.toUpperCase() || "INVESTOR"}
      </Text>

      <View className="w-[54px] flex-row items-center justify-end gap-2">
        {user?.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            style={{ height: 28, width: 28, borderRadius: 14 }}
          />
        ) : (
          <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-[#D4AF37]">
            <Text className="font-sans-bold text-[12px] text-white">{initials}</Text>
          </View>
        )}
        <View>
          <Ionicons name="notifications-outline" size={22} color="#111111" />
          <View className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#D33131]" />
        </View>
      </View>
    </View>
  );
}

function NetWorthCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { walletAccounts, quickDeposit, quickWithdraw, getTotalBalance } = useWalletStore();
  const mainWallet = walletAccounts.find((w) => w.id === "wa-main");
  const totalBalance = getTotalBalance();

  const handleOpenModal = (type: "deposit" | "withdraw") => {
    setModalType(type);
    setAmount("");
    setModalVisible(true);
  };

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    if (modalType === "withdraw") {
      if (!mainWallet) {
        Alert.alert("No Wallet", "A wallet is required to withdraw.");
        return;
      }
      if (num > mainWallet.availableBalance) {
        Alert.alert("Insufficient Funds", "You don't have enough balance for this withdrawal.");
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      if (modalType === "deposit") {
        quickDeposit("wa-main", num);
        Alert.alert("Success", `R${num.toLocaleString()} deposited successfully!`);
      } else {
        quickWithdraw("wa-main", num);
        Alert.alert("Success", `R${num.toLocaleString()} withdrawn successfully!`);
      }
      setLoading(false);
      setModalVisible(false);
      setAmount("");
    }, 1500);
  };

  const formatBalance = (value: number) => {
    return `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      <View
        className="overflow-hidden rounded-[5px] bg-primary"
        style={{
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        }}
      >
        <View className="items-center px-5 pb-4 pt-3">
          <Text className="font-sans text-[14px] leading-[18px] text-white/90">Total Net Worth</Text>
          <Text className="mt-1 font-serif text-[38px] leading-[44px] text-white">
            {formatBalance(totalBalance)}
          </Text>
          <Image
            source={images.innovestIconTree}
            resizeMode="contain"
            style={{ height: 45, marginTop: 1, tintColor: "#FFFFFF", width: 45 }}
          />
        </View>

        <View className="h-px bg-white/20" />

        <View className="flex-row gap-4 px-4 py-3">
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => handleOpenModal("deposit")}
            style={{
              alignItems: "center",
              backgroundColor: "rgba(54, 59, 16, 0.35)",
              borderRadius: 6,
              flex: 1,
              height: 38,
              justifyContent: "center",
            }}
          >
            <Text className="font-sans-bold text-[14px] text-white">Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={() => handleOpenModal("withdraw")}
            style={{
              alignItems: "center",
              borderColor: "#D4AF37",
              borderRadius: 6,
              borderWidth: 1,
              flex: 1,
              height: 38,
              justifyContent: "center",
            }}
          >
            <Text className="font-sans-bold text-[14px] text-[#D4AF37]">Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            padding: 24,
            width: "85%",
            maxWidth: 340,
          }}>
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", textAlign: "center" }}>
              {modalType === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#666666", textAlign: "center", marginTop: 6 }}>
              {modalType === "deposit"
                ? "Enter the amount you want to deposit"
                : `Available: ${formatBalance(mainWallet?.availableBalance ?? 0)}`}
            </Text>

            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
              placeholderTextColor="#999999"
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 16,
                color: "#111111",
                borderWidth: 1,
                borderColor: "#D5DABF",
                borderRadius: 8,
                height: 50,
                paddingHorizontal: 16,
                marginTop: 18,
                textAlign: "center",
              }}
            />

            <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalVisible(false)}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#D5DABF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#666666" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 8,
                  backgroundColor: modalType === "deposit" ? "#6B7220" : "#EE2023",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 6,
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons
                      name={modalType === "deposit" ? "add-circle-outline" : "remove-circle-outline"}
                      size={18}
                      color="#FFF"
                    />
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 14, color: "#FFFFFF" }}>
                      {modalType === "deposit" ? "Deposit" : "Withdraw"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const formatRands = (value: number) =>
  `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function ProductGrid() {
  const { transactions, getTotalBalance } = useWalletStore();
  const {
    goals,
    fixedInvestments,
    getTotalSaved,
    getTotalFixedInvested,
  } = useInvestmentStore();
  const groups = useGroupsStore((s) => s.groups);

  const activeFixed = fixedInvestments.filter((fi) => fi.status === "active");
  const primaryGoal: InvestmentGoal | undefined =
    goals.find((g) => g.status === "active") ?? goals[0];
  const biggestGroup = [...groups].sort((a, b) => b.members.length - a.members.length)[0];
  const totalGroupsBalance = groups.reduce((sum, g) => sum + g.balance, 0);
  const totalMembers = groups.reduce((sum, g) => sum + g.members.length, 0);

  return (
    <View className="mt-3 flex-row flex-wrap gap-2">
      <FeatureCard title="InnoVest Wallet Card" subtitle="Checking Wallet" amount={formatRands(getTotalBalance())}>
        <View className="absolute right-2 top-2 h-[23px] w-[31px] rounded-[3px] border border-[#8C9164] bg-[#F6F4E8]">
          <View className="mt-[5px] h-px bg-[#8C9164]" />
          <View className="ml-1 mt-1 h-1.5 w-3 rounded-full bg-[#D4AF37]" />
        </View>
        <Text className="mt-2 font-sans text-[9px] leading-[12px] text-[#333333]">Recent transactions</Text>
        {transactions.length === 0 ? (
          <Text className="mt-1 font-sans text-[8px] leading-[10px] text-[#999999]">
            No transactions yet
          </Text>
        ) : (
          transactions.slice(0, 2).map((tx) => (
            <MoneyRow
              key={tx.id}
              label={tx.description}
              value={`${isCredit(tx) ? "+" : "-"}${formatRands(tx.amount)}`}
            />
          ))
        )}
      </FeatureCard>

      <FeatureCard title="Instant Investment Card" subtitle="Fixed Investments" amount={formatRands(getTotalFixedInvested())}>
        {activeFixed.length === 0 ? (
          <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#999999]">
            No active fixed investments yet
          </Text>
        ) : (
          <>
            <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#333333]">
              {`${activeFixed.length} Term${activeFixed.length > 1 ? "s" : ""} Active (${activeFixed[0].term} mo @ ${activeFixed[0].interestRate}%)`}
            </Text>
            <View className="mt-2 h-[4px] overflow-hidden rounded-full bg-[#D8DDC7]">
              <View className="h-full w-full rounded-full bg-[#D4AF37]" />
            </View>
            <View className="mt-2 flex-row items-center justify-between">
              <View className="flex-row items-center gap-1">
                <Ionicons name="time-outline" size={12} color="#6B7220" />
                <Text className="font-sans text-[9px] text-[#333333]">Term</Text>
              </View>
              <Ionicons name="trending-up-outline" size={20} color="#6B7220" />
            </View>
          </>
        )}
      </FeatureCard>

      <FeatureCard title="Savings Goals Card" subtitle="Save-to-Invest Goals" amount={formatRands(getTotalSaved())}>
        {!primaryGoal ? (
          <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#999999]">
            No savings goals yet
          </Text>
        ) : (
          <>
            <View className="mt-1 flex-row items-center gap-1">
              <Ionicons name="flag-outline" size={14} color="#6B7220" />
              <Text className="font-sans text-[10px] text-[#333333]" numberOfLines={1}>
                {primaryGoal.name}
              </Text>
            </View>
            <View className="mt-1 h-[7px] overflow-hidden rounded-full bg-[#D8DDC7]">
              <View
                className="h-full rounded-full bg-[#D4AF37]"
                style={{
                  width: `${Math.min(Math.round((primaryGoal.savedAmount / primaryGoal.targetAmount) * 100), 100)}%`,
                }}
              />
            </View>
            <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#333333]">
              {primaryGoal.lockDate
                ? `Goal lock date: ${new Date(primaryGoal.lockDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}`
                : `${Math.round((primaryGoal.savedAmount / primaryGoal.targetAmount) * 100)}% of target`}
            </Text>
          </>
        )}
      </FeatureCard>

      <FeatureCard title="Joint Accounts Card" subtitle="Joint Accounts/Groups" amount={formatRands(totalGroupsBalance)}>
        {groups.length === 0 ? (
          <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#999999]">
            No joint accounts yet
          </Text>
        ) : (
          <>
            <View className="mt-2 flex-row items-center justify-between">
              <StackedAvatars members={biggestGroup?.members ?? []} />
              <Ionicons name="people-outline" size={21} color="#6B7220" />
            </View>
            <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#333333]">
              {groups.length} group{groups.length > 1 ? "s" : ""} · {totalMembers} member{totalMembers === 1 ? "" : "s"}
            </Text>
          </>
        )}
      </FeatureCard>
    </View>
  );
}

const isCredit = (tx: Transaction) =>
  tx.type === "deposit" || tx.type === "transfer-in" || tx.type === "dividend";

function FeatureCard({
  amount,
  children,
  subtitle,
  title,
}: {
  amount: string;
  children: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <View
      className="min-h-[121px] flex-1 basis-[47%] rounded-[6px] border border-[#D5DABF] bg-white p-2"
      style={{
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      }}
    >
      <Text className="font-sans-bold text-[10px] leading-[13px] text-[#111111]">{title}</Text>
      <Text className="font-sans text-[9px] leading-[12px] text-[#333333]">{subtitle}</Text>
      <Text className="mt-2 font-sans text-[22px] leading-[27px] text-[#111111]">{amount}</Text>
      {children}
    </View>
  );
}

function MoneyRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="mt-0.5 flex-row items-center justify-between">
      <Text className="font-sans text-[8px] leading-[10px] text-[#333333]">{label}</Text>
      <Text className="font-sans text-[8px] leading-[10px] text-[#111111]">{value}</Text>
    </View>
  );
}

function StackedAvatars({ members }: { members: GroupMember[] }) {
  const maxShow = 3;
  const shown = members.slice(0, maxShow);
  const overflow = members.length - shown.length;

  return (
    <View className="h-8 w-[76px] flex-row">
      {shown.map((member, index) => (
        <View
          key={member.id}
          className="h-8 w-8 items-center justify-center rounded-full border border-white"
          style={{ backgroundColor: member.color, marginLeft: index === 0 ? 0 : -12 }}
        >
          <Text className="font-sans-bold text-[9px] text-white">{member.initials}</Text>
        </View>
      ))}
      {overflow > 0 && (
        <View
          className="h-8 w-8 items-center justify-center rounded-full border border-white bg-[#EEF2E4]"
          style={{ marginLeft: -12 }}
        >
          <Text className="font-sans-bold text-[9px] text-[#333333]">+{overflow}</Text>
        </View>
      )}
    </View>
  );
}

const activityIcons: Record<string, string> = {
  deposit: "arrow-down-circle",
  withdrawal: "arrow-up-circle",
  "transfer-in": "swap-horizontal",
  "transfer-out": "swap-horizontal",
  investment: "chart-line",
  dividend: "gift-outline",
};

function RecentActivity() {
  const transactions = useWalletStore((s) => s.transactions);
  const recent = transactions.slice(0, 3);

  return (
    <View className="mt-3">
      <Text className="mb-1 font-sans-bold text-[15px] leading-[19px] text-[#111111]">Recent Activity</Text>
      {recent.length === 0 ? (
        <View className="flex-row items-center rounded-[8px] border border-dashed border-[#D5DABF] bg-white px-2 py-3">
          <View className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-[#EEF2E4]">
            <MaterialCommunityIcons name="piggy-bank-outline" size={20} color="#6B7220" />
          </View>
          <View className="flex-1">
            <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]">No activity yet</Text>
            <Text className="font-sans text-[9px] leading-[12px] text-[#666666]">
              Your deposits and investments will show up here
            </Text>
          </View>
        </View>
      ) : (
        <View className="gap-2">
          {recent.map((tx) => (
            <View
              key={tx.id}
              className="flex-row items-center rounded-[8px] border border-[#D5DABF] bg-white px-2 py-2"
            >
              <View className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-[#EEF2E4]">
                <MaterialCommunityIcons
                  name={(activityIcons[tx.type] ?? "circle") as any}
                  size={20}
                  color="#6B7220"
                />
              </View>
              <View className="flex-1">
                <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]" numberOfLines={1}>
                  {tx.description}
                </Text>
                <Text className="font-sans text-[9px] leading-[12px] text-[#666666]">
                  {new Date(tx.date).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]">
                {`${isCredit(tx) ? "+" : "-"}${formatRands(tx.amount)}`}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function GroupActivity() {
  const groups = useGroupsStore((s) => s.groups);

  const pending = groups.flatMap((g) =>
    g.withdrawalRequests
      .filter((wr) => wr.status === "pending")
      .map((wr) => ({ group: g, request: wr }))
  );
  const needsMyVote = pending.find(
    ({ request }) =>
      !request.approvals.includes(currentUser.id) &&
      !request.rejections.includes(currentUser.id)
  );

  return (
    <View className="mt-3">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="font-sans-bold text-[15px] leading-[19px] text-[#111111]">Group Activity</Text>
        {pending.length > 0 && (
          <View className="flex-row items-center gap-1">
            <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]">Notifications</Text>
            <View className="h-2 w-2 rounded-full bg-[#6B7220]" />
          </View>
        )}
      </View>
      <View className="flex-row items-center rounded-[8px] border border-dashed border-[#D5DABF] bg-white px-2 py-3">
        <View className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-[#EEF2E4]">
          <Ionicons name="alert-circle-outline" size={21} color="#6B7220" />
        </View>
        <View className="flex-1">
          <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]" numberOfLines={1}>
            {needsMyVote
              ? `Active Vote: ${needsMyVote.group.name}`
              : pending.length > 0
                ? `Vote in progress: ${pending[0].group.name}`
                : "No group activity yet"}
          </Text>
          <Text className="font-sans text-[9px] leading-[12px] text-[#666666]">
            {needsMyVote
              ? `${needsMyVote.request.purpose} · Needs your vote`
              : pending.length > 0
                ? `${pending[0].request.purpose} · Awaiting consensus`
                : "Votes and payouts will appear here"}
          </Text>
        </View>
      </View>
    </View>
  );
}
