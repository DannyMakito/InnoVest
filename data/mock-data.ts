import { Group, GroupMember, WithdrawalRequest } from "@/types/groups";

const members: GroupMember[] = [
  { id: "u1", name: "You", initials: "YO", color: "#6B7220", isAdmin: true },
  { id: "u2", name: "Thabo M", initials: "TM", color: "#D4AF37", isAdmin: false },
  { id: "u3", name: "Naledi K", initials: "NK", color: "#8B7355", isAdmin: false },
  { id: "u4", name: "Sipho D", initials: "SD", color: "#556B2F", isAdmin: false },
  { id: "u5", name: "Lerato P", initials: "LP", color: "#B8860B", isAdmin: false },
  { id: "u6", name: "Pieter V", initials: "PV", color: "#6B8E23", isAdmin: false },
  { id: "u7", name: "Zanele M", initials: "ZM", color: "#DAA520", isAdmin: false },
  { id: "u8", name: "Ravi S", initials: "RS", color: "#808000", isAdmin: false },
  { id: "u9", name: "Anri B", initials: "AB", color: "#BDB76B", isAdmin: false },
  { id: "u10", name: "Johan W", initials: "JW", color: "#9B870C", isAdmin: false },
];

const pendingRequests: WithdrawalRequest[] = [
  {
    id: "wr1",
    groupId: "g1",
    requestedBy: members[0],
    amount: 1000,
    purpose: "Rooftop Repair",
    status: "pending",
    approvals: ["u1", "u2", "u3"],
    rejections: [],
    createdAt: "2026-07-28",
  },
];

const releasedRequests: WithdrawalRequest[] = [
  {
    id: "wr2",
    groupId: "g1",
    requestedBy: members[2],
    amount: 500,
    purpose: "Community Event",
    status: "approved",
    approvals: ["u1", "u2", "u3", "u4", "u5"],
    rejections: [],
    createdAt: "2026-07-20",
  },
];

export const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Capitec Stokvel",
    members: members.slice(0, 10),
    balance: 45200,
    withdrawalRequests: [...pendingRequests, ...releasedRequests],
    createdAt: "2025-01-15",
  },
  {
    id: "g2",
    name: "Family Fund",
    members: members.slice(0, 3),
    balance: 12800,
    withdrawalRequests: [
      {
        id: "wr3",
        groupId: "g2",
        requestedBy: members[1],
        amount: 2500,
        purpose: "School Fees",
        status: "pending",
        approvals: ["u2"],
        rejections: [],
        createdAt: "2026-07-25",
      },
    ],
    createdAt: "2025-06-10",
  },
  {
    id: "g3",
    name: "Investment Circle",
    members: members.slice(0, 5),
    balance: 78500,
    withdrawalRequests: [],
    createdAt: "2024-11-20",
  },
];

export const currentUser: GroupMember = members[0];
