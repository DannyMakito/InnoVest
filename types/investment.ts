export interface InvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  minInvestment: number;
  deadline: string;
  lockDate?: string;
  status: "active" | "completed" | "locked";
  createdAt: string;
}

export interface Contribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  reference: string;
  type: "manual" | "automatic" | "dividend";
}

export interface FixedInvestment {
  id: string;
  name: string;
  amount: number;
  term: number; // months
  interestRate: number; // percentage
  startDate: string;
  endDate: string;
  status: "active" | "matured" | "withdrawn";
  projectedReturn: number;
}

export type InvestmentTerm = 6 | 12 | 24;
