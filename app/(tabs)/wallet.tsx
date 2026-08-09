import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "@/store/wallet-store";
import { LinkedAccount, Transaction } from "@/types/wallet";

export default function WalletScreen() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }} edges={["top"]}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111111", marginBottom: 4 }}>
          Wallet
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#666666" }}>
          Manage your funds and view transactions
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
        <BalanceCard />
        <QuickActions
          onDeposit={() => setShowDeposit(true)}
          onWithdraw={() => setShowWithdraw(true)}
          onTransfer={() => setShowTransfer(true)}
        />
        <LinkedAccountsSection />
        <RecentTransactions
          onViewAll={() => setShowHistory(true)}
          onSelect={(tx) => setSelectedTx(tx)}
        />
      </ScrollView>

      <DepositModal visible={showDeposit} onClose={() => setShowDeposit(false)} />
      <WithdrawalModal visible={showWithdraw} onClose={() => setShowWithdraw(false)} />
      <InternalTransferModal visible={showTransfer} onClose={() => setShowTransfer(false)} />
      <TransactionHistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        onSelect={(tx) => setSelectedTx(tx)}
      />
      {selectedTx && (
        <TransactionDetailModal
          transaction={selectedTx}
          visible={!!selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </SafeAreaView>
  );
}

function BalanceCard() {
  const { getTotalBalance, getSelectedWallet, walletAccounts, setSelectedWallet, selectedWalletId } = useWalletStore();
  const total = getTotalBalance();
  const selected = getSelectedWallet();

  return (
    <View style={{ marginBottom: 18 }}>
      <View
        style={{
          backgroundColor: "#6B7220",
          borderRadius: 14,
          padding: 18,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#FFFFFFCC" }}>Total Balance</Text>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 28, color: "#D4AF37", marginTop: 4 }}>
          R {total.toLocaleString()}.00
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#FFFFFFAA", marginTop: 2 }}>
          {selected?.name}
        </Text>

        <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
          {walletAccounts.map((w) => (
            <TouchableOpacity
              key={w.id}
              activeOpacity={0.8}
              onPress={() => setSelectedWallet(w.id)}
              style={{
                flex: 1,
                height: 38,
                borderRadius: 8,
                backgroundColor: selectedWalletId === w.id ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.12)",
                borderWidth: 1,
                borderColor: selectedWalletId === w.id ? "#D4AF37" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#FFFFFFAA" }}>{w.name}</Text>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 13, color: "#FFFFFF", marginTop: 1 }}>
                R {w.balance.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

function QuickActions({
  onDeposit,
  onWithdraw,
  onTransfer,
}: {
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
}) {
  const actions = [
    { icon: "arrow-down-outline", label: "Deposit", onPress: onDeposit, bg: "#6B7220" },
    { icon: "arrow-up-outline", label: "Withdraw", onPress: onWithdraw, bg: "#FFFFFF", border: true },
    { icon: "swap-horizontal-outline", label: "Transfer", onPress: onTransfer, bg: "#FFFFFF", border: true },
  ];

  return (
    <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
      {actions.map((a) => (
        <TouchableOpacity
          key={a.label}
          activeOpacity={0.85}
          onPress={a.onPress}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 10,
            backgroundColor: a.bg,
            borderWidth: a.border ? 1 : 0,
            borderColor: "#D5DABF",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Ionicons name={a.icon as any} size={22} color={a.border ? "#6B7220" : "#FFFFFF"} />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: a.border ? "#6B7220" : "#FFFFFF" }}>
            {a.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function LinkedAccountsSection() {
  const { linkedAccounts, removeLinkedAccount } = useWalletStore();

  const handleRemove = (account: LinkedAccount) => {
    Alert.alert(
      "Remove Account",
      `Remove ${account.name} (•••• ${account.lastFour})?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeLinkedAccount(account.id) },
      ]
    );
  };

  return (
    <View style={{ marginBottom: 18 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111111" }}>Linked Accounts</Text>
        <TouchableOpacity style={{ padding: 4 }}>
          <Ionicons name="add-circle-outline" size={20} color="#6B7220" />
        </TouchableOpacity>
      </View>
      {linkedAccounts.map((acc) => (
        <View
          key={acc.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#D5DABF",
            padding: 12,
            marginBottom: 8,
          }}
        >
          <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: acc.color, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 13, color: "#FFFFFF" }}>{acc.bank.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#111111" }}>{acc.name}</Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#666666" }}>•{acc.lastFour} · {acc.type}</Text>
          </View>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 14, color: acc.balance < 0 ? "#EE2023" : "#111111", marginRight: 8 }}>
            R {Math.abs(acc.balance).toLocaleString()}.00
          </Text>
          <TouchableOpacity onPress={() => handleRemove(acc)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={18} color="#EE2023" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function RecentTransactions({
  onViewAll,
  onSelect,
}: {
  onViewAll: () => void;
  onSelect: (tx: Transaction) => void;
}) {
  const { transactions } = useWalletStore();
  const recent = transactions.slice(0, 5);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111111" }}>Recent Transactions</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#6B7220" }}>View All</Text>
        </TouchableOpacity>
      </View>
      {recent.map((tx) => (
        <TransactionRow key={tx.id} transaction={tx} onPress={() => onSelect(tx)} />
      ))}
    </View>
  );
}

function TransactionRow({ transaction, onPress }: { transaction: Transaction; onPress: () => void }) {
  const icon = typeIcons[transaction.type] || "ellipse";
  const color = typeColors[transaction.type] || "#999";
  const isCredit =
    transaction.type === "deposit" ||
    transaction.type === "transfer-in" ||
    transaction.type === "dividend";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        padding: 12,
        marginBottom: 8,
      }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: `${color}18`, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#111111" }} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#999999" }}>{transaction.date}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 14, color: isCredit ? "#6B7220" : "#EE2023" }}>
          {isCredit ? "+" : "-"}R {transaction.amount.toLocaleString()}.00
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#999999", marginTop: 2, textTransform: "capitalize" }}>
          {transaction.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const typeIcons: Record<string, string> = {
  deposit: "arrow-down-circle",
  withdrawal: "arrow-up-circle",
  "transfer-in": "swap-horizontal",
  "transfer-out": "swap-horizontal",
  investment: "trending-up",
  dividend: "gift",
};

const typeColors: Record<string, string> = {
  deposit: "#6B7220",
  withdrawal: "#EE2023",
  "transfer-in": "#6B7220",
  "transfer-out": "#EE2023",
  investment: "#D4AF37",
  dividend: "#D4AF37",
};

// ─── STEP INDICATOR ─────────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 16, marginBottom: 20, gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: i < current ? "#6B7220" : "#E0E0E0",
          }}
        />
      ))}
    </View>
  );
}

// ─── ROW COMPONENT ────────────────────────────────────────────────────────────────

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: last ? 0 : 1, borderBottomColor: "#F0F0F0" }}>
      <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#666666" }}>{label}</Text>
      <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#111111" }}>{value}</Text>
    </View>
  );
}

// ─── DEPOSIT MODAL ────────────────────────────────────────────────────────────────

function DepositModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"eft" | "instant">("eft");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [result, setResult] = useState<Transaction | null>(null);
  const { linkedAccounts, walletAccounts, selectedWalletId, deposit } = useWalletStore();

  const minAmount = 100;
  const maxAmount = 100000;
  const numAmount = parseInt(amount) || 0;
  const isValidAmount = numAmount >= minAmount && numAmount <= maxAmount;

  const handleDeposit = () => {
    if (!isValidAmount || !selectedAccount) return;
    const tx = deposit(selectedWalletId, numAmount, selectedAccount);
    setResult(tx);
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setAmount("");
    setSelectedAccount(null);
    setResult(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={reset} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1, textAlign: "center" }}>
            {step === 4 ? "Deposit Complete" : "Deposit Funds"}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {step < 4 && <StepIndicator current={step} total={3} />}

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, flex: 1 }}>
          {step === 1 && (
            <View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 12 }}>
                Select Method
              </Text>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setMethod("eft")}
                  style={{
                    flex: 1,
                    height: 80,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: method === "eft" ? "#6B7220" : "#D5DABF",
                    backgroundColor: method === "eft" ? "#EEF2E4" : "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                  }}
                >
                  <Ionicons name="card-outline" size={24} color={method === "eft" ? "#6B7220" : "#333333"} />
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#111111", marginTop: 4, textAlign: "center" }}>
                    Standard EFT
                  </Text>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#999999" }}>1-2 business days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setMethod("instant")}
                  style={{
                    flex: 1,
                    height: 80,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: method === "instant" ? "#6B7220" : "#D5DABF",
                    backgroundColor: method === "instant" ? "#EEF2E4" : "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                  }}
                >
                  <Ionicons name="flash-outline" size={24} color={method === "instant" ? "#6B7220" : "#333333"} />
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#111111", marginTop: 4, textAlign: "center" }}>
                    Instant EFT
                  </Text>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#999999" }}>Immediate</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 8 }}>From Account</Text>
              {linkedAccounts.filter((a) => a.balance > 0).map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedAccount(acc.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selectedAccount === acc.id ? "#6B7220" : "#D5DABF",
                    backgroundColor: selectedAccount === acc.id ? "#EEF2E4" : "#FFFFFF",
                    marginBottom: 8,
                  }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: acc.color, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 12, color: "#FFFFFF" }}>{acc.bank.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111111" }}>{acc.name}</Text>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#666666" }}>Balance: R {acc.balance.toLocaleString()}</Text>
                  </View>
                  {selectedAccount === acc.id && <Ionicons name="checkmark-circle" size={20} color="#6B7220" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 8 }}>Enter Amount</Text>
              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#D5DABF", padding: 14, marginBottom: 8, alignItems: "center" }}>
                <TextInput
                  style={{ fontFamily: "Inter-Bold", fontSize: 28, color: "#111111", textAlign: "center", width: "100%" }}
                  placeholder="R 0"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={amount ? `R ${parseInt(amount).toLocaleString()}` : ""}
                  onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
                />
              </View>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#666666", textAlign: "center", marginBottom: 12 }}>
                Min: R {minAmount.toLocaleString()} · Max: R {maxAmount.toLocaleString()}
              </Text>
              {amount && !isValidAmount && (
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#EE2023", textAlign: "center", marginBottom: 8 }}>
                  Amount must be between R {minAmount.toLocaleString()} and R {maxAmount.toLocaleString()}
                </Text>
              )}
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[500, 1000, 5000].map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    activeOpacity={0.85}
                    onPress={() => setAmount(String(preset))}
                    style={{ flex: 1, height: 42, borderRadius: 8, backgroundColor: "#EEF2E4", alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#6B7220" }}>R {preset.toLocaleString()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#D5DABF", padding: 16, marginBottom: 16 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111111", marginBottom: 10 }}>Review Deposit</Text>
                <Row label="Amount" value={`R ${numAmount.toLocaleString()}.00`} />
                <Row label="Method" value={method === "eft" ? "Standard EFT" : "Instant EFT"} />
                <Row label="From" value={linkedAccounts.find((a) => a.id === selectedAccount)?.name || ""} />
                <Row label="To" value={walletAccounts.find((w) => w.id === selectedWalletId)?.name || ""} />
                <Row label="Fee" value={method === "instant" ? "R 10.00" : "Free"} last />
              </View>

              <View style={{ backgroundColor: "#EEF2E4", borderRadius: 10, padding: 14, marginBottom: 8 }}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7220" }}>
                  Trust Account Details:
                </Text>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#6B7220", marginTop: 4 }}>
                  Bank: Capitec Bank · Account: 1234567890 · Branch: 470010
                </Text>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#6B7220", marginTop: 2 }}>
                  Reference: Your User ID (required for processing)
                </Text>
              </View>
            </View>
          )}

          {step === 4 && result && (
            <View style={{ alignItems: "center", paddingTop: 20 }}>
              <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#EEF2E4", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Ionicons name="checkmark-circle" size={40} color="#6B7220" />
              </View>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111111", marginBottom: 4 }}>
                Deposit Successful
              </Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#666666", marginBottom: 20, textAlign: "center" }}>
                R {numAmount.toLocaleString()}.00 has been deposited
              </Text>
              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#D5DABF", padding: 16, width: "100%" }}>
                <Row label="Reference" value={result.reference || ""} />
                <Row label="Date" value={result.date} />
                <Row label="Status" value={result.status} last />
              </View>
            </View>
          )}
        </ScrollView>

        {step >= 2 && step <= 3 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={step === 2 ? !isValidAmount : !isValidAmount || !selectedAccount}
              onPress={() => setStep(step + 1)}
              style={{
                height: 52, borderRadius: 12,
                backgroundColor: (step === 2 ? !isValidAmount : !isValidAmount || !selectedAccount) ? "#D1D5DB" : "#6B7220",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 1 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={method !== "eft" && method !== "instant"}
              onPress={() => setStep(step + 1)}
              style={{ height: 52, borderRadius: 12, backgroundColor: "#6B7220", alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 10 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleDeposit}
              style={{ height: 52, borderRadius: 12, backgroundColor: "#6B7220", alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Confirm Deposit</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 4 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity activeOpacity={0.85} onPress={reset}
              style={{ height: 52, borderRadius: 12, backgroundColor: "#6B7220", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

// ─── WITHDRAWAL MODAL ────────────────────────────────────────────────────────────

function WithdrawalModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [result, setResult] = useState<Transaction | null>(null);
  const { linkedAccounts, getSelectedWallet, withdraw } = useWalletStore();

  const wallet = getSelectedWallet();
  const numAmount = parseInt(amount) || 0;
  const isValidAmount = numAmount > 0 && wallet && numAmount <= wallet.availableBalance && selectedAccount;

  const processWithdrawal = () => {
    if (pin !== "1234") { setPinError(true); return; }
    const tx = withdraw(wallet!.id, numAmount, selectedAccount!, pin);
    if (tx) { setResult(tx); setStep(4); }
    else { setPinError(true); }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const np = pin + digit; setPin(np); setPinError(false);
      if (np.length === 4) setTimeout(() => processWithdrawal(), 300);
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1)); setPinError(false);
  };

  const reset = () => {
    setStep(1); setAmount(""); setSelectedAccount(null); setPin(""); setPinError(false); setResult(null); onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={reset} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1, textAlign: "center" }}>
            {step === 4 ? "Withdrawal Complete" : "Withdraw Funds"}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {step < 4 && <StepIndicator current={step} total={3} />}

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, flex: 1 }}>
          {step === 1 && (
            <View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 8 }}>Enter Amount</Text>
              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#D5DABF", padding: 14, marginBottom: 8, alignItems: "center" }}>
                <TextInput
                  style={{ fontFamily: "Inter-Bold", fontSize: 28, color: "#111111", textAlign: "center", width: "100%" }}
                  placeholder="R 0"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={amount ? `R ${parseInt(amount).toLocaleString()}` : ""}
                  onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
                />
              </View>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#666666", textAlign: "center", marginBottom: 16 }}>
                Available: R {wallet?.availableBalance.toLocaleString()}.00
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[500, 1000, 5000].map((preset) => (
                  <TouchableOpacity key={preset} activeOpacity={0.85} onPress={() => setAmount(String(preset))}
                    style={{ flex: 1, height: 42, borderRadius: 8, backgroundColor: "#EEF2E4", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#6B7220" }}>R {preset.toLocaleString()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 8 }}>Select Destination</Text>
              {linkedAccounts.map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedAccount(acc.id)}
                  style={{
                    flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10,
                    borderWidth: 2, borderColor: selectedAccount === acc.id ? "#6B7220" : "#D5DABF",
                    backgroundColor: selectedAccount === acc.id ? "#EEF2E4" : "#FFFFFF", marginBottom: 8,
                  }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: acc.color, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 12, color: "#FFFFFF" }}>{acc.bank.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111111" }}>{acc.name}</Text>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#666666" }}>•{acc.lastFour} · {acc.type}</Text>
                  </View>
                  {selectedAccount === acc.id && <Ionicons name="checkmark-circle" size={20} color="#6B7220" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 3 && (
            <View style={{ alignItems: "center" }}>
              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#D5DABF", padding: 16, width: "100%", marginBottom: 20 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111111", marginBottom: 10 }}>Review Withdrawal</Text>
                <Row label="Amount" value={`R ${numAmount.toLocaleString()}.00`} />
                <Row label="From" value={wallet?.name || ""} />
                <Row label="To" value={linkedAccounts.find((a) => a.id === selectedAccount)?.name || ""} />
                <Row label="Fee" value="Free" last />
              </View>

              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 8 }}>Enter PIN</Text>
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={{
                      width: 52, height: 52, borderRadius: 10, borderWidth: 2,
                      borderColor: pinError ? "#EE2023" : pin.length > i ? "#6B7220" : "#D5DABF",
                      backgroundColor: pin.length > i ? "#EEF2E4" : "#FFFFFF",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {pin.length > i && <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: pinError ? "#EE2023" : "#6B7220" }} />}
                  </View>
                ))}
              </View>
              {pinError && <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#EE2023", marginBottom: 8 }}>Incorrect PIN.</Text>}

              <View style={{ width: "100%", gap: 8 }}>
                {[["1","2","3"],["4","5","6"],["7","8","9"],["","0","del"]].map((row, ri) => (
                  <View key={ri} style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                    {row.map((key) => {
                      if (key === "") return <View key={key} style={{ width: 72, height: 52 }} />;
                      if (key === "del") return (
                        <TouchableOpacity key={key} activeOpacity={0.7} onPress={handlePinDelete}
                          style={{ width: 72, height: 52, borderRadius: 10, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" }}>
                          <Ionicons name="backspace-outline" size={22} color="#333333" />
                        </TouchableOpacity>
                      );
                      return (
                        <TouchableOpacity key={key} activeOpacity={0.7}
                          onPress={() => handlePinInput(key)}
                          style={{ width: 72, height: 52, borderRadius: 10, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D5DABF", alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ fontFamily: "Inter-Bold", fontSize: 22, color: "#111111" }}>{key}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#999999", marginTop: 12 }}>Hint: PIN is 1234</Text>
            </View>
          )}

          {step === 4 && result && (
            <View style={{ alignItems: "center", paddingTop: 20 }}>
              <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#EEF2E4", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Ionicons name="checkmark-circle" size={40} color="#6B7220" />
              </View>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111111", marginBottom: 4 }}>Withdrawal Successful</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#666666", marginBottom: 20, textAlign: "center" }}>
                R {numAmount.toLocaleString()}.00 has been sent
              </Text>
              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#D5DABF", padding: 16, width: "100%" }}>
                <Row label="Reference" value={result.reference || ""} />
                <Row label="Date" value={result.date} />
                <Row label="Status" value={result.status} last />
              </View>
            </View>
          )}
        </ScrollView>

        {step === 1 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity activeOpacity={0.85} disabled={!numAmount || numAmount <= 0 || (wallet && numAmount > wallet.availableBalance)}
              onPress={() => setStep(2)}
              style={{ height: 52, borderRadius: 12, backgroundColor: (!numAmount || numAmount <= 0 || (wallet && numAmount > wallet.availableBalance)) ? "#D1D5DB" : "#6B7220", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity activeOpacity={0.85} disabled={!selectedAccount}
              onPress={() => setStep(3)}
              style={{ height: 52, borderRadius: 12, backgroundColor: !selectedAccount ? "#D1D5DB" : "#6B7220", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 4 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity activeOpacity={0.85} onPress={reset}
              style={{ height: 52, borderRadius: 12, backgroundColor: "#6B7220", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

// ─── INTERNAL TRANSFER MODAL ─────────────────────────────────────────────────────

function InternalTransferModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [fromWallet, setFromWallet] = useState<string | null>(null);
  const [toWallet, setToWallet] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<Transaction | null>(null);
  const { walletAccounts, transfer } = useWalletStore();

  const numAmount = parseInt(amount) || 0;
  const from = walletAccounts.find((w) => w.id === fromWallet);
  const to = walletAccounts.find((w) => w.id === toWallet);
  const isValid = from && to && fromWallet !== toWallet && numAmount > 0 && from.availableBalance >= numAmount;

  const handleTransfer = () => {
    if (!isValid) return;
    const tx = transfer(fromWallet!, toWallet!, numAmount);
    if (tx) { setResult(tx); setStep(4); }
  };

  const reset = () => {
    setStep(1); setFromWallet(null); setToWallet(null); setAmount(""); setResult(null); onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={reset} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1, textAlign: "center" }}>
            {step === 4 ? "Transfer Complete" : "Transfer Between Accounts"}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {step < 4 && <StepIndicator current={step} total={3} />}

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, flex: 1 }}>
          {step === 1 && (
            <View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 8 }}>Select From Account</Text>
              {walletAccounts.map((w) => (
                <TouchableOpacity
                  key={w.id}
                  activeOpacity={0.8}
                  onPress={() => setFromWallet(w.id)}
                  style={{
                    flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10,
                    borderWidth: 2, borderColor: fromWallet === w.id ? "#6B7220" : "#D5DABF",
                    backgroundColor: fromWallet === w.id ? "#EEF2E4" : "#FFFFFF", marginBottom: 8,
                  }}
                >
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#6B7220", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                    <Ionicons name="wallet-outline" size={18} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111111" }}>{w.name}</Text>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#666666" }}>
                      Available: R {w.availableBalance.toLocaleString()}.00
                    </Text>
                  </View>
                  {fromWallet === w.id && <Ionicons name="checkmark-circle" size={20} color="#6B7220" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 8 }}>Select To Account</Text>
              {walletAccounts.filter((w) => w.id !== fromWallet).map((w) => (
                <TouchableOpacity
                  key={w.id}
                  activeOpacity={0.8}
                  onPress={() => setToWallet(w.id)}
                  style={{
                    flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10,
                    borderWidth: 2, borderColor: toWallet === w.id ? "#6B7220" : "#D5DABF",
                    backgroundColor: toWallet === w.id ? "#EEF2E4" : "#FFFFFF", marginBottom: 8,
                  }}
                >
                  <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#D4AF37", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                    <Ionicons name="wallet-outline" size={18} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111111" }}>{w.name}</Text>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#666666" }}>
                      Balance: R {w.balance.toLocaleString()}.00
                    </Text>
                  </View>
                  {toWallet === w.id && <Ionicons name="checkmark-circle" size={20} color="#6B7220" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 8 }}>Enter Amount</Text>
              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 10, borderWidth: 1, borderColor: "#D5DABF", padding: 14, marginBottom: 8, alignItems: "center" }}>
                <TextInput
                  style={{ fontFamily: "Inter-Bold", fontSize: 28, color: "#111111", textAlign: "center", width: "100%" }}
                  placeholder="R 0"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={amount ? `R ${parseInt(amount).toLocaleString()}` : ""}
                  onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
                />
              </View>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#666666", textAlign: "center", marginBottom: 16 }}>
                From: {from?.name} (R {from?.availableBalance.toLocaleString()})
              </Text>

              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#D5DABF", padding: 16 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111111", marginBottom: 10 }}>Review Transfer</Text>
                <Row label="From" value={from?.name || ""} />
                <Row label="To" value={to?.name || ""} />
                <Row label="Amount" value={`R ${numAmount.toLocaleString()}.00`} />
                <Row label="Fee" value="Free" last />
              </View>
            </View>
          )}

          {step === 4 && result && (
            <View style={{ alignItems: "center", paddingTop: 20 }}>
              <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#EEF2E4", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Ionicons name="checkmark-circle" size={40} color="#6B7220" />
              </View>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111111", marginBottom: 4 }}>Transfer Successful</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#666666", marginBottom: 20, textAlign: "center" }}>
                R {numAmount.toLocaleString()}.00 transferred
              </Text>
              <View style={{ backgroundColor: "#FFFFFF", borderRadius: 12, borderWidth: 1, borderColor: "#D5DABF", padding: 16, width: "100%" }}>
                <Row label="From" value={from?.name || ""} />
                <Row label="To" value={to?.name || ""} />
                <Row label="Reference" value={result.reference || ""} />
                <Row label="Date" value={result.date} last />
              </View>
            </View>
          )}
        </ScrollView>

        {step === 1 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity activeOpacity={0.85} disabled={!fromWallet}
              onPress={() => setStep(2)}
              style={{ height: 52, borderRadius: 12, backgroundColor: !fromWallet ? "#D1D5DB" : "#6B7220", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity activeOpacity={0.85} disabled={!toWallet}
              onPress={() => setStep(3)}
              style={{ height: 52, borderRadius: 12, backgroundColor: !toWallet ? "#D1D5DB" : "#6B7220", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 10 }}>
            <TouchableOpacity activeOpacity={0.85} disabled={!isValid}
              onPress={handleTransfer}
              style={{ height: 52, borderRadius: 12, backgroundColor: !isValid ? "#D1D5DB" : "#6B7220", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Confirm Transfer</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 4 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <TouchableOpacity activeOpacity={0.85} onPress={reset}
              style={{ height: 52, borderRadius: 12, backgroundColor: "#6B7220", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

// ─── TRANSACTION HISTORY MODAL ───────────────────────────────────────────────────

function TransactionHistoryModal({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (tx: Transaction) => void;
}) {
  const [filter, setFilter] = useState("all");
  const { transactions } = useWalletStore();

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1, textAlign: "center" }}>
            All Transactions
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}>
          {["all", "deposit", "withdrawal", "transfer-in", "transfer-out", "investment", "dividend"].map((f) => (
            <TouchableOpacity
              key={f}
              activeOpacity={0.8}
              onPress={() => setFilter(f)}
              style={{
                height: 34, borderRadius: 17,
                backgroundColor: filter === f ? "#6B7220" : "#FFFFFF",
                borderWidth: 1, borderColor: filter === f ? "#6B7220" : "#D5DABF",
                paddingHorizontal: 14, alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: filter === f ? "#FFFFFF" : "#333333" }}>
                {f === "all" ? "All" : f.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
          {filtered.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} onPress={() => { onSelect(tx); onClose(); }} />
          ))}
          {filtered.length === 0 && (
            <View style={{ alignItems: "center", paddingTop: 40 }}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#999999" }}>No transactions found</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── TRANSACTION DETAIL MODAL ────────────────────────────────────────────────────

function TransactionDetailModal({
  transaction,
  visible,
  onClose,
}: {
  transaction: Transaction;
  visible: boolean;
  onClose: () => void;
}) {
  const icon = typeIcons[transaction.type] || "ellipse";
  const color = typeColors[transaction.type] || "#999";
  const isCredit =
    transaction.type === "deposit" ||
    transaction.type === "transfer-in" ||
    transaction.type === "dividend";

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }} edges={["top"]}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1, textAlign: "center" }}>
            Transaction Details
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: `${color}18`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons name={icon as any} size={28} color={color} />
            </View>
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 24, color: isCredit ? "#6B7220" : "#EE2023" }}>
              {isCredit ? "+" : "-"}R {transaction.amount.toLocaleString()}.00
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#666666", marginTop: 4 }}>
              {transaction.description}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#D5DABF",
              padding: 16,
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#999999", textTransform: "uppercase", marginBottom: 12 }}>
              Transaction Details
            </Text>
            <Row label="Type" value={transaction.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} />
            <Row label="Date" value={transaction.date} />
            <Row label="Reference" value={transaction.reference || "N/A"} />
            <Row label="Status" value={transaction.status} />
            {transaction.fromAccount && <Row label="From" value={transaction.fromAccount} />}
            {transaction.toAccount && <Row label="To" value={transaction.toAccount} />}
            <Row label="Amount" value={`R ${transaction.amount.toLocaleString()}.00`} last />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
