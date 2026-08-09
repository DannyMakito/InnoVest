import { create } from "zustand";
import { WalletAccount, LinkedAccount, Transaction } from "@/types/wallet";
import { mockWalletAccounts, mockLinkedAccounts, mockTransactions } from "@/data/wallet-mock-data";

interface WalletState {
  walletAccounts: WalletAccount[];
  linkedAccounts: LinkedAccount[];
  transactions: Transaction[];
  selectedWalletId: string;
  setSelectedWallet: (id: string) => void;
  getSelectedWallet: () => WalletAccount | undefined;
  getTotalBalance: () => number;
  addLinkedAccount: (bank: string, name: string, lastFour: string, type: LinkedAccount["type"], balance: number) => void;
  removeLinkedAccount: (accountId: string) => void;
  deposit: (walletId: string, amount: number, fromAccountId: string) => Transaction;
  withdraw: (walletId: string, amount: number, toAccountId: string, pin: string) => Transaction | null;
  transfer: (fromWalletId: string, toWalletId: string, amount: number) => Transaction | null;
  getTransactionsByWallet: (walletId: string) => Transaction[];
  getFilteredTransactions: (walletId: string, type?: string, dateFrom?: string, dateTo?: string) => Transaction[];
  quickDeposit: (walletId: string, amount: number) => Transaction;
  quickWithdraw: (walletId: string, amount: number) => Transaction | null;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  walletAccounts: mockWalletAccounts,
  linkedAccounts: mockLinkedAccounts,
  transactions: mockTransactions,
  selectedWalletId: "wa1",

  setSelectedWallet: (id) => set({ selectedWalletId: id }),

  getSelectedWallet: () => {
    const { walletAccounts, selectedWalletId } = get();
    return walletAccounts.find((w) => w.id === selectedWalletId);
  },

  getTotalBalance: () => {
    return get().walletAccounts.reduce((sum, w) => sum + w.balance, 0);
  },

  addLinkedAccount: (bank, name, lastFour, type, balance) => {
    const bankColors: Record<string, string> = {
      Capitec: "#6B7220",
      FNB: "#D4AF37",
      "Standard Bank": "#556B2F",
      ABSA: "#8B7355",
      Nedbank: "#003B5C",
      "African Bank": "#E31837",
      TymeBank: "#00C4B4",
      Discovery: "#006B5E",
    };
    const newAccount: LinkedAccount = {
      id: `la${Date.now()}`,
      name,
      bank,
      lastFour,
      type,
      balance,
      color: bankColors[bank] || "#6B7220",
    };
    set((state) => ({ linkedAccounts: [...state.linkedAccounts, newAccount] }));
  },

  removeLinkedAccount: (accountId) => {
    set((state) => ({
      linkedAccounts: state.linkedAccounts.filter((a) => a.id !== accountId),
    }));
  },

  deposit: (walletId, amount, fromAccountId) => {
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      type: "deposit",
      amount,
      description: `Deposit from linked account`,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      fromAccount: get().linkedAccounts.find((a) => a.id === fromAccountId)?.name,
      reference: `DEP-${Date.now()}`,
    };

    set((state) => ({
      walletAccounts: state.walletAccounts.map((w) =>
        w.id === walletId
          ? { ...w, balance: w.balance + amount, availableBalance: w.availableBalance + amount }
          : w
      ),
      linkedAccounts: state.linkedAccounts.map((a) =>
        a.id === fromAccountId ? { ...a, balance: a.balance - amount } : a
      ),
      transactions: [newTx, ...state.transactions],
    }));

    return newTx;
  },

  withdraw: (walletId, amount, toAccountId, pin) => {
    if (pin !== "1234") return null;

    const wallet = get().walletAccounts.find((w) => w.id === walletId);
    if (!wallet || wallet.availableBalance < amount) return null;

    const newTx: Transaction = {
      id: `t${Date.now()}`,
      type: "withdrawal",
      amount,
      description: `Withdrawal to linked account`,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      toAccount: get().linkedAccounts.find((a) => a.id === toAccountId)?.name,
      reference: `WTH-${Date.now()}`,
    };

    set((state) => ({
      walletAccounts: state.walletAccounts.map((w) =>
        w.id === walletId
          ? { ...w, balance: w.balance - amount, availableBalance: w.availableBalance - amount }
          : w
      ),
      linkedAccounts: state.linkedAccounts.map((a) =>
        a.id === toAccountId ? { ...a, balance: a.balance + amount } : a
      ),
      transactions: [newTx, ...state.transactions],
    }));

    return newTx;
  },

  transfer: (fromWalletId, toWalletId, amount) => {
    const fromWallet = get().walletAccounts.find((w) => w.id === fromWalletId);
    if (!fromWallet || fromWallet.availableBalance < amount) return null;

    const newTxOut: Transaction = {
      id: `t${Date.now()}`,
      type: "transfer-out",
      amount,
      description: `Transfer to ${get().walletAccounts.find((w) => w.id === toWalletId)?.name}`,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      toAccount: get().walletAccounts.find((w) => w.id === toWalletId)?.name,
      reference: `TRF-${Date.now()}`,
    };

    const newTxIn: Transaction = {
      id: `t${Date.now() + 1}`,
      type: "transfer-in",
      amount,
      description: `Transfer from ${fromWallet.name}`,
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      fromAccount: fromWallet.name,
      reference: `TRF-${Date.now()}-IN`,
    };

    set((state) => ({
      walletAccounts: state.walletAccounts.map((w) => {
        if (w.id === fromWalletId) return { ...w, balance: w.balance - amount, availableBalance: w.availableBalance - amount };
        if (w.id === toWalletId) return { ...w, balance: w.balance + amount, availableBalance: w.availableBalance + amount };
        return w;
      }),
      transactions: [newTxOut, newTxIn, ...state.transactions],
    }));

    return newTxOut;
  },

  getTransactionsByWallet: (walletId) => {
    const wallet = get().walletAccounts.find((w) => w.id === walletId);
    if (!wallet) return [];
    return get().transactions.filter(
      (t) =>
        t.fromAccount?.includes(wallet.name) ||
        t.toAccount?.includes(wallet.name) ||
        t.description.includes(wallet.name)
    );
  },

  getFilteredTransactions: (walletId, type, dateFrom, dateTo) => {
    let txs = get().getTransactionsByWallet(walletId);
    if (type && type !== "all") txs = txs.filter((t) => t.type === type);
    if (dateFrom) txs = txs.filter((t) => t.date >= dateFrom);
    if (dateTo) txs = txs.filter((t) => t.date <= dateTo);
    return txs;
  },

  quickDeposit: (walletId, amount) => {
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      type: "deposit",
      amount,
      description: "Quick Deposit",
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      reference: `DEP-${Date.now()}`,
    };

    set((state) => ({
      walletAccounts: state.walletAccounts.map((w) =>
        w.id === walletId
          ? { ...w, balance: w.balance + amount, availableBalance: w.availableBalance + amount }
          : w
      ),
      transactions: [newTx, ...state.transactions],
    }));

    return newTx;
  },

  quickWithdraw: (walletId, amount) => {
    const wallet = get().walletAccounts.find((w) => w.id === walletId);
    if (!wallet || wallet.availableBalance < amount) return null;

    const newTx: Transaction = {
      id: `t${Date.now()}`,
      type: "withdrawal",
      amount,
      description: "Quick Withdrawal",
      date: new Date().toISOString().split("T")[0],
      status: "completed",
      reference: `WTH-${Date.now()}`,
    };

    set((state) => ({
      walletAccounts: state.walletAccounts.map((w) =>
        w.id === walletId
          ? { ...w, balance: w.balance - amount, availableBalance: w.availableBalance - amount }
          : w
      ),
      transactions: [newTx, ...state.transactions],
    }));

    return newTx;
  },
}));
