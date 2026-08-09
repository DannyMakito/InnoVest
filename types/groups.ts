export interface GroupMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  isAdmin: boolean;
}

export interface WithdrawalRequest {
  id: string;
  groupId: string;
  requestedBy: GroupMember;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "released";
  approvals: string[];
  rejections: string[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  balance: number;
  withdrawalRequests: WithdrawalRequest[];
  createdAt: string;
}

export type VoteChoice = "approve" | "reject";
