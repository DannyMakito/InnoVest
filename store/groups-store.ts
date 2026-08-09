import { create } from "zustand";
import { Group, GroupMember, WithdrawalRequest } from "@/types/groups";
import { mockGroups, currentUser } from "@/data/mock-data";

interface GroupsState {
  groups: Group[];
  selectedGroupId: string | null;
  searchQuery: string;
  setSelectedGroup: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredGroups: () => Group[];
  getSelectedGroup: () => Group | undefined;
  createGroup: (name: string, memberIds: string[]) => void;
  voteOnRequest: (groupId: string, requestId: string, choice: "approve" | "reject") => void;
  releaseFunds: (groupId: string, requestId: string, pin: string) => boolean;
  createWithdrawalRequest: (groupId: string, amount: number, purpose: string) => void;
}

const extraMembers: GroupMember[] = [
  { id: "u11", name: "Mandla N", initials: "MN", color: "#708090", isAdmin: false },
  { id: "u12", name: "Fatima A", initials: "FA", color: "#CD853F", isAdmin: false },
  { id: "u13", name: "Chris L", initials: "CL", color: "#6B8E23", isAdmin: false },
  { id: "u14", name: "Precious T", initials: "PT", color: "#DAA520", isAdmin: false },
  { id: "u15", name: "James K", initials: "JK", color: "#8FBC8F", isAdmin: false },
];

export const allAvailableMembers: GroupMember[] = [
  currentUser,
  ...extraMembers,
];

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: mockGroups,
  selectedGroupId: null,
  searchQuery: "",

  setSelectedGroup: (id) => set({ selectedGroupId: id }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredGroups: () => {
    const { groups, searchQuery } = get();
    if (!searchQuery.trim()) return groups;
    return groups.filter((g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

  getSelectedGroup: () => {
    const { groups, selectedGroupId } = get();
    return groups.find((g) => g.id === selectedGroupId);
  },

  createGroup: (name, memberIds) => {
    const newGroup: Group = {
      id: `g${Date.now()}`,
      name,
      members: [
        currentUser,
        ...allAvailableMembers.filter((m) => memberIds.includes(m.id) && m.id !== currentUser.id),
      ],
      balance: 0,
      withdrawalRequests: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ groups: [...state.groups, newGroup] }));
  },

  voteOnRequest: (groupId, requestId, choice) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          withdrawalRequests: g.withdrawalRequests.map((wr) => {
            if (wr.id !== requestId) return wr;
            const alreadyVoted =
              wr.approvals.includes(currentUser.id) ||
              wr.rejections.includes(currentUser.id);
            if (alreadyVoted) return wr;

            const approvals =
              choice === "approve"
                ? [...wr.approvals, currentUser.id]
                : wr.approvals;
            const rejections =
              choice === "reject"
                ? [...wr.rejections, currentUser.id]
                : wr.rejections;

            const totalMembers = g.members.length;
            const required = Math.ceil(totalMembers * 0.51);
            let status = wr.status;
            if (approvals.length >= required) status = "approved";
            else if (rejections.length >= required) status = "rejected";

            return { ...wr, approvals, rejections, status };
          }),
        };
      }),
    }));
  },

  releaseFunds: (groupId, requestId, pin) => {
    if (pin !== "1234") return false;
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          balance:
            g.balance -
            (g.withdrawalRequests.find((wr) => wr.id === requestId)?.amount ?? 0),
          withdrawalRequests: g.withdrawalRequests.map((wr) =>
            wr.id === requestId ? { ...wr, status: "released" as const } : wr
          ),
        };
      }),
    }));
    return true;
  },

  createWithdrawalRequest: (groupId, amount, purpose) => {
    const newRequest: WithdrawalRequest = {
      id: `wr${Date.now()}`,
      groupId,
      requestedBy: currentUser,
      amount,
      purpose,
      status: "pending",
      approvals: [currentUser.id],
      rejections: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId
          ? { ...g, withdrawalRequests: [...g.withdrawalRequests, newRequest] }
          : g
      ),
    }));
  },
}));
