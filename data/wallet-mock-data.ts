import { LinkedAccount, WalletAccount, Transaction } from "@/types/wallet";

export const mockLinkedAccounts: LinkedAccount[] = [
  { id: "la1", name: "Capitec Savings", bank: "Capitec", lastFour: "4521", type: "savings", balance: 45200, color: "#6B7220" },
  { id: "la2", name: "FNB Cheque", bank: "FNB", lastFour: "8834", type: "cheque", balance: 12800, color: "#D4AF37" },
  { id: "la3", name: "Standard Bank", bank: "Standard Bank", lastFour: "2290", type: "savings", balance: 78500, color: "#556B2F" },
  { id: "la4", name: "ABSA Credit", bank: "ABSA", lastFour: "6617", type: "credit", balance: -3200, color: "#8B7355" },
];

export const mockWalletAccounts: WalletAccount[] = [
  { id: "wa1", name: "Main Wallet", balance: 5850, availableBalance: 5850 },
  { id: "wa2", name: "Investment Wallet", balance: 25000, availableBalance: 25000 },
  { id: "wa3", name: "Savings Wallet", balance: 10000, availableBalance: 10000 },
];

export const mockTransactions: Transaction[] = [
  { id: "t1", type: "deposit", amount: 2000, description: "EFT Deposit from Capitec", date: "2026-07-28", status: "completed", fromAccount: "Capitec Savings", reference: "DEP-001" },
  { id: "t2", type: "transfer-out", amount: 15000, description: "Moved to Fixed Investment", date: "2026-07-27", status: "completed", toAccount: "Investment Wallet", reference: "TRF-002" },
  { id: "t3", type: "deposit", amount: 1000, description: "Goal Top-Up", date: "2026-07-26", status: "completed", fromAccount: "FNB Cheque", reference: "DEP-003" },
  { id: "t4", type: "withdrawal", amount: 500, description: "ATM Withdrawal", date: "2026-07-25", status: "completed", toAccount: "Capitec Savings", reference: "WTH-004" },
  { id: "t5", type: "transfer-in", amount: 3500, description: "Group Payout - Capitec Stokvel", date: "2026-07-24", status: "completed", fromAccount: "Group Account", reference: "TRF-005" },
  { id: "t6", type: "investment", amount: 5000, description: "Fixed Investment - 12 Month", date: "2026-07-22", status: "completed", reference: "INV-006" },
  { id: "t7", type: "dividend", amount: 320, description: "Investment Dividend", date: "2026-07-20", status: "completed", reference: "DIV-007" },
  { id: "t8", type: "deposit", amount: 8500, description: "Salary Deposit", date: "2026-07-15", status: "completed", fromAccount: "Employer", reference: "DEP-008" },
  { id: "t9", type: "withdrawal", amount: 200, description: "Send Money - Thabo", date: "2026-07-14", status: "completed", reference: "WTH-009" },
  { id: "t10", type: "transfer-out", amount: 1000, description: "Transfer to Savings Wallet", date: "2026-07-12", status: "completed", toAccount: "Savings Wallet", reference: "TRF-010" },
  { id: "t11", type: "deposit", amount: 450, description: "Refund - Insurance", date: "2026-07-10", status: "pending", fromAccount: "Standard Bank", reference: "DEP-011" },
  { id: "t12", type: "withdrawal", amount: 1200, description: "Payment - Electricity", date: "2026-07-08", status: "completed", reference: "WTH-012" },
];

export const mockBankInfo = {
  name: "InnoVest Trust Account",
  bank: "Capitec Bank",
  accountNumber: "1234567890",
  branchCode: "470010",
  reference: "",
};
