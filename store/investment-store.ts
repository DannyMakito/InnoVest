import { create } from "zustand";
import { InvestmentGoal, Contribution, FixedInvestment } from "@/types/investment";
import { mockInvestmentGoals, mockContributions, mockFixedInvestments } from "@/data/investment-mock-data";

interface InvestmentState {
  goals: InvestmentGoal[];
  contributions: Contribution[];
  fixedInvestments: FixedInvestment[];
  selectedGoalId: string | null;
  selectedFixedInvestmentId: string | null;
  automaticDeductionEnabled: Record<string, boolean>;
  automaticDeductionAmounts: Record<string, number>;
  setSelectedGoal: (id: string | null) => void;
  setSelectedFixedInvestment: (id: string | null) => void;
  getSelectedGoal: () => InvestmentGoal | undefined;
  getGoalContributions: (goalId: string) => Contribution[];
  contributeToGoal: (goalId: string, amount: number) => Contribution | null;
  toggleAutomaticDeduction: (goalId: string) => void;
  setAutomaticDeductionAmount: (goalId: string, amount: number) => void;
  createGoal: (name: string, targetAmount: number, deadline: string, minInvestment: number, lockDate?: string) => void;
  getTotalSaved: () => number;
  getTotalTarget: () => number;
  getTotalFixedInvested: () => number;
  getTotalProjectedReturns: () => number;
  getActiveInvestmentsCount: () => number;
  withdrawFromGoal: (goalId: string, amount: number) => boolean;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  goals: mockInvestmentGoals,
  contributions: mockContributions,
  fixedInvestments: mockFixedInvestments,
  selectedGoalId: null,
  selectedFixedInvestmentId: null,
  automaticDeductionEnabled: {},
  automaticDeductionAmounts: {},

  setSelectedGoal: (id) => set({ selectedGoalId: id }),

  setSelectedFixedInvestment: (id) => set({ selectedFixedInvestmentId: id }),

  getSelectedGoal: () => {
    const { goals, selectedGoalId } = get();
    return goals.find((g) => g.id === selectedGoalId);
  },

  getGoalContributions: (goalId) => {
    return get().contributions.filter((c) => c.goalId === goalId);
  },

  contributeToGoal: (goalId, amount) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal || amount < goal.minInvestment) return null;

    const newContribution: Contribution = {
      id: `c${Date.now()}`,
      goalId,
      amount,
      date: new Date().toISOString().split("T")[0],
      reference: `PH. Agust***234`,
      type: get().automaticDeductionEnabled[goalId] ? "automatic" : "manual",
    };

    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              savedAmount: g.savedAmount + amount,
              status: g.savedAmount + amount >= g.targetAmount ? "completed" : g.status,
            }
          : g
      ),
      contributions: [newContribution, ...state.contributions],
    }));

    return newContribution;
  },

  withdrawFromGoal: (goalId, amount) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return false;

    if (goal.lockDate) {
      const lockDate = new Date(goal.lockDate);
      if (new Date() < lockDate) return false;
    }

    if (goal.savedAmount < amount) return false;

    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId
          ? { ...g, savedAmount: g.savedAmount - amount }
          : g
      ),
    }));

    return true;
  },

  toggleAutomaticDeduction: (goalId) => {
    set((state) => ({
      automaticDeductionEnabled: {
        ...state.automaticDeductionEnabled,
        [goalId]: !state.automaticDeductionEnabled[goalId],
      },
    }));
  },

  setAutomaticDeductionAmount: (goalId, amount) => {
    set((state) => ({
      automaticDeductionAmounts: {
        ...state.automaticDeductionAmounts,
        [goalId]: amount,
      },
    }));
  },

  createGoal: (name, targetAmount, deadline, minInvestment, lockDate) => {
    const newGoal: InvestmentGoal = {
      id: `ig${Date.now()}`,
      name,
      targetAmount,
      savedAmount: 0,
      minInvestment,
      deadline,
      lockDate,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ goals: [...state.goals, newGoal] }));
  },

  getTotalSaved: () => {
    return get().goals.reduce((sum, g) => sum + g.savedAmount, 0);
  },

  getTotalTarget: () => {
    return get().goals.reduce((sum, g) => sum + g.targetAmount, 0);
  },

  getTotalFixedInvested: () => {
    return get().fixedInvestments
      .filter((fi) => fi.status === "active")
      .reduce((sum, fi) => sum + fi.amount, 0);
  },

  getTotalProjectedReturns: () => {
    return get().fixedInvestments
      .filter((fi) => fi.status === "active")
      .reduce((sum, fi) => sum + fi.projectedReturn, 0);
  },

  getActiveInvestmentsCount: () => {
    const activeGoals = get().goals.filter((g) => g.status === "active").length;
    const activeFixed = get().fixedInvestments.filter((fi) => fi.status === "active").length;
    return activeGoals + activeFixed;
  },
}));
