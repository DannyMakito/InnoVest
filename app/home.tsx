import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/images";

const recentActivity = [
  {
    icon: "swap-horizontal",
    title: "EFT Deposit from Capitec",
    date: "Jan 12, 2022",
    amount: "+R 2,000.00",
  },
  {
    icon: "chart-line",
    title: "Moved to Fixed Invest",
    date: "Jan 12, 2022",
    amount: "-R 15,000.00",
  },
  {
    icon: "piggy-bank-outline",
    title: "Goal Top-Up",
    date: "Jan 12, 2022",
    amount: "+R 1,000.00",
  },
] as const;

export default function Home() {
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
  return (
    <View className="mb-1 flex-row items-center justify-between">
      <View className="w-[54px] items-start">
        <Image source={images.innovestIconTree} resizeMode="contain" style={{ height: 36, width: 36 }} />
      </View>

      <Text className="font-sans-bold text-[14px] leading-[18px] tracking-[0.2px] text-[#111111]">
        YOUR MONEY HUB
      </Text>

      <View className="w-[54px] flex-row items-center justify-end gap-2">
        <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-[#D4AF37]">
          <Text className="font-sans-bold text-[12px] text-white">J</Text>
        </View>
        <View>
          <Ionicons name="notifications-outline" size={22} color="#111111" />
          <View className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#D33131]" />
        </View>
      </View>
    </View>
  );
}

function NetWorthCard() {
  return (
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
        <Text className="mt-1 font-serif text-[38px] leading-[44px] text-white">R 78,500.00</Text>
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
  );
}

function ProductGrid() {
  return (
    <View className="mt-3 flex-row flex-wrap gap-2">
      <FeatureCard title="InnoVest Wallet Card" subtitle="Checking Wallet" amount="R 5,000.00">
        <View className="absolute right-2 top-2 h-[23px] w-[31px] rounded-[3px] border border-[#8C9164] bg-[#F6F4E8]">
          <View className="mt-[5px] h-px bg-[#8C9164]" />
          <View className="ml-1 mt-1 h-1.5 w-3 rounded-full bg-[#D4AF37]" />
        </View>
        <Text className="mt-2 font-sans text-[9px] leading-[12px] text-[#333333]">Recent transactions</Text>
        <MoneyRow label="Pay darentaments" value="-5.00" />
        <MoneyRow label="Pay wallet" value="+50.00" />
      </FeatureCard>

      <FeatureCard title="Instant Investment Card" subtitle="Fixed Investments" amount="R 25,000.00">
        <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#333333]">
          1 Term Active (12 mo @ 9.5%)
        </Text>
        <View className="mt-2 h-[4px] overflow-hidden rounded-full bg-[#D8DDC7]">
          <View className="h-full w-[68%] rounded-full bg-[#D4AF37]" />
        </View>
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={12} color="#6B7220" />
            <Text className="font-sans text-[9px] text-[#333333]">Term</Text>
          </View>
          <Ionicons name="trending-up-outline" size={20} color="#6B7220" />
        </View>
      </FeatureCard>

      <FeatureCard title="Savings Goals Card" subtitle="Save-to-Invest Goals" amount="R 10,000.00">
        <View className="mt-1 flex-row items-center gap-1">
          <Ionicons name="home-outline" size={14} color="#6B7220" />
          <Text className="font-sans text-[10px] text-[#333333]">Home</Text>
        </View>
        <View className="mt-1 h-[7px] overflow-hidden rounded-full bg-[#D8DDC7]">
          <View className="h-full w-[58%] rounded-full bg-[#D4AF37]" />
        </View>
        <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#333333]">
          Goal lock date: 16 Apr 2022
        </Text>
      </FeatureCard>

      <FeatureCard title="Joint Accounts Card" subtitle="Joint Accounts/Groups" amount="R 38,500.00">
        <View className="mt-2 flex-row items-center justify-between">
          <StackedAvatars />
          <Ionicons name="people-outline" size={21} color="#6B7220" />
        </View>
        <Text className="mt-1 font-sans text-[9px] leading-[12px] text-[#333333]">3 members</Text>
      </FeatureCard>
    </View>
  );
}

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

function StackedAvatars() {
  return (
    <View className="h-8 w-[76px] flex-row">
      {["#E0C892", "#334729", "#F1D17A", "#FFFFFF"].map((color, index) => (
        <View
          key={color}
          className="h-8 w-8 items-center justify-center rounded-full border border-white"
          style={{ backgroundColor: color, marginLeft: index === 0 ? 0 : -12 }}
        >
          <Text className="font-sans-bold text-[9px] text-[#333333]">
            {index === 3 ? "+3" : ""}
          </Text>
        </View>
      ))}
    </View>
  );
}

function RecentActivity() {
  return (
    <View className="mt-3">
      <Text className="mb-1 font-sans-bold text-[15px] leading-[19px] text-[#111111]">Recent Activity</Text>
      <View className="gap-2">
        {recentActivity.map((activity) => (
          <View
            key={activity.title}
            className="flex-row items-center rounded-[8px] border border-[#D5DABF] bg-white px-2 py-2"
          >
            <View className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-[#EEF2E4]">
              <MaterialCommunityIcons name={activity.icon} size={20} color="#6B7220" />
            </View>
            <View className="flex-1">
              <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]">{activity.title}</Text>
              <Text className="font-sans text-[9px] leading-[12px] text-[#666666]">{activity.date}</Text>
            </View>
            <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]">{activity.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function GroupActivity() {
  return (
    <View className="mt-3">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="font-sans-bold text-[15px] leading-[19px] text-[#111111]">Group Activity</Text>
        <View className="flex-row items-center gap-1">
          <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]">Notifications</Text>
          <View className="h-2 w-2 rounded-full bg-[#6B7220]" />
        </View>
      </View>
      <View className="flex-row items-center rounded-[8px] border border-[#D5DABF] bg-white px-2 py-2">
        <View className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-[#EEF2E4]">
          <Ionicons name="alert-circle-outline" size={21} color="#6B7220" />
        </View>
        <View className="flex-1">
          <Text className="font-sans-bold text-[12px] leading-[15px] text-[#111111]">
            Active Vote: Family Stokvel Withdrawa
          </Text>
          <Text className="font-sans text-[9px] leading-[12px] text-[#666666]">Needs your vote today</Text>
        </View>
      </View>
    </View>
  );
}
