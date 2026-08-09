export interface LinkedAccount {
  id: string;
  name: string;
  bank: string;
  lastFour: string;
  type: "savings" | "cheque" | "credit";
  balance: number;
  color: string;
}

export interface WalletAccount {
  id: string;
  name: string;
  balance: number;
  availableBalance: number;
}

export type TransactionType = "deposit" | "withdrawal" | "transfer-in" | "transfer-out" | "investment" | "dividend";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  status: TransactionStatus;
  fromAccount?: string;
  toAccount?: string;
  reference?: string;
}

export interface BankInfo {
  name: string;
  code: string;
  accountNumber: string;
  branchCode: string;
}
