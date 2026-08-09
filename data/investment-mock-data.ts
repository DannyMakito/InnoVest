import { InvestmentGoal, Contribution, FixedInvestment } from "@/types/investment";

export const mockInvestmentGoals: InvestmentGoal[] = [
  {
    id: "ig1",
    name: "Cape Town Apartment Fund",
    targetAmount: 500000,
    savedAmount: 125000,
    minInvestment: 1000,
    deadline: "2026-03-10",
    status: "active",
    createdAt: "2025-06-15",
  },
  {
    id: "ig2",
    name: "Education Fund",
    targetAmount: 200000,
    savedAmount: 85000,
    minInvestment: 500,
    deadline: "2027-01-20",
    status: "active",
    createdAt: "2025-09-01",
  },
  {
    id: "ig3",
    name: "Emergency Reserve",
    targetAmount: 100000,
    savedAmount: 100000,
    minInvestment: 500,
    deadline: "2025-12-31",
    lockDate: "2025-12-31",
    status: "completed",
    createdAt: "2025-01-10",
  },
];

export const mockContributions: Contribution[] = [
  { id: "c1", goalId: "ig1", amount: 125000, date: "2026-07-15", reference: "PH. Agust***234", type: "manual" },
  { id: "c2", goalId: "ig1", amount: 125000, date: "2026-06-20", reference: "PH. Agust***234", type: "automatic" },
  { id: "c3", goalId: "ig1", amount: 50000, date: "2026-05-10", reference: "PH. Agust***234", type: "manual" },
  { id: "c4", goalId: "ig1", amount: 35000, date: "2026-04-05", reference: "PH. Agust***234", type: "dividend" },
  { id: "c5", goalId: "ig2", amount: 85000, date: "2026-07-10", reference: "PH. Agust***234", type: "manual" },
];

export const mockFixedInvestments: FixedInvestment[] = [
  {
    id: "fi1",
    name: "Fixed Deposit - 12 Month",
    amount: 25000,
    term: 12,
    interestRate: 9.5,
    startDate: "2026-01-15",
    endDate: "2027-01-15",
    status: "active",
    projectedReturn: 27375,
  },
  {
    id: "fi2",
    name: "Fixed Deposit - 6 Month",
    amount: 10000,
    term: 6,
    interestRate: 8.0,
    startDate: "2026-04-01",
    endDate: "2026-10-01",
    status: "active",
    projectedReturn: 10400,
  },
];
