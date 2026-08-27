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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useGroupsStore, allAvailableMembers, currentUser } from "@/store/groups-store";
import { Group, GroupMember, WithdrawalRequest } from "@/types/groups";

export default function GroupsScreen() {
  const [screen, setScreen] = useState<"list" | "detail">("list");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [showPin, setShowPin] = useState(false);

  const {
    selectedGroupId,
    setSelectedGroup,
  } = useGroupsStore();

  const handleSelectGroup = (id: string) => {
    setSelectedGroup(id);
    setScreen("detail");
  };

  const handleBack = () => {
    setSelectedGroup(null);
    setScreen("list");
  };

  const handleVoteOnRequest = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
  };

  const handleReleaseFunds = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setShowPin(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }} edges={["top"]}>
      {screen === "list" ? (
        <GroupsList
          onSelectGroup={handleSelectGroup}
          onCreateGroup={() => setShowCreate(true)}
        />
      ) : (
        <GroupDetail
          onBack={handleBack}
          onVoteRequest={handleVoteOnRequest}
          onReleaseFunds={handleReleaseFunds}
        />
      )}

      <CreateGroupModal visible={showCreate} onClose={() => setShowCreate(false)} />

      {selectedRequest && (
        <WithdrawalRequestModal
          request={selectedRequest}
          visible={!!selectedRequest && !showPin}
          onClose={() => setSelectedRequest(null)}
          groupId={selectedGroupId!}
        />
      )}

      {selectedRequest && (
        <AdminPinModal
          request={selectedRequest}
          visible={showPin}
          onClose={() => {
            setShowPin(false);
            setSelectedRequest(null);
          }}
          groupId={selectedGroupId!}
        />
      )}
    </SafeAreaView>
  );
}

function GroupsList({
  onSelectGroup,
  onCreateGroup,
}: {
  onSelectGroup: (id: string) => void;
  onCreateGroup: () => void;
}) {
  const { searchQuery, setSearchQuery, getFilteredGroups } = useGroupsStore();
  const groups = getFilteredGroups();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111111", marginBottom: 12 }}>
          Groups
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#D5DABF",
            paddingHorizontal: 12,
            height: 44,
            marginBottom: 16,
          }}
        >
          <Ionicons name="search" size={18} color="#999999" />
          <TextInput
            style={{ flex: 1, marginLeft: 8, fontFamily: "Inter-Regular", fontSize: 14, color: "#333333" }}
            placeholder="Search groups..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
      >
        {groups.length === 0 && (
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#D5DABF",
              borderStyle: "dashed",
              padding: 32,
            }}
          >
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#EEF2E4", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="people-outline" size={28} color="#6B7220" />
            </View>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111111", marginTop: 12 }}>
              {searchQuery.trim() ? "No groups found" : "No groups yet"}
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#666666", marginTop: 4, textAlign: "center" }}>
              {searchQuery.trim()
                ? "Try a different search term"
                : "Create your first group to start saving together"}
            </Text>
          </View>
        )}
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onPress={() => onSelectGroup(group.id)} />
        ))}
      </ScrollView>

      <View style={{ position: "absolute", bottom: 20, left: 16, right: 16 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onCreateGroup}
          style={{
            backgroundColor: "#6B7220",
            borderRadius: 12,
            height: 52,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>
            Create Group
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function GroupCard({ group, onPress }: { group: Group; onPress: () => void }) {
  const hasActiveVote = group.withdrawalRequests.some((wr) => wr.status === "pending");
  const maxShow = 4;
  const avatars = group.members.slice(0, maxShow);
  const extra = group.members.length - maxShow;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D5DABF",
        padding: 14,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: "#111111" }}>
            {group.name}
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#666666", marginTop: 2 }}>
            {group.members.length} members
          </Text>
        </View>
        {hasActiveVote && (
          <View
            style={{
              backgroundColor: "#EE2023",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: "#FFFFFF" }}>
              Active Vote
            </Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "row" }}>
            {avatars.map((m, i) => (
              <View
                key={m.id}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: m.color,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#FFFFFF",
                  marginLeft: i === 0 ? 0 : -8,
                }}
              >
                <Text style={{ fontFamily: "Inter-Bold", fontSize: 9, color: "#FFFFFF" }}>
                  {m.initials}
                </Text>
              </View>
            ))}
          </View>
          {extra > 0 && (
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#666666", marginLeft: 6 }}>
              +{extra}
            </Text>
          )}
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#666666" }}>
            Group Balance
          </Text>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: "#6B7220" }}>
            R {group.balance.toLocaleString()}.00
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function GroupDetail({
  onBack,
  onVoteRequest,
  onReleaseFunds,
}: {
  onBack: () => void;
  onVoteRequest: (request: WithdrawalRequest) => void;
  onReleaseFunds: (request: WithdrawalRequest) => void;
}) {
  const { getSelectedGroup, voteOnRequest } = useGroupsStore();
  const group = getSelectedGroup();

  if (!group) return null;

  const pendingRequests = group.withdrawalRequests.filter((wr) => wr.status === "pending");
  const approvedRequests = group.withdrawalRequests.filter(
    (wr) => wr.status === "approved" || wr.status === "released"
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
          gap: 12,
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1 }}>
          {group.name}
        </Text>
        <TouchableOpacity style={{ padding: 4 }}>
          <Ionicons name="ellipsis-vertical" size={20} color="#111111" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
        <View
          style={{
            backgroundColor: "#6B7220",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#FFFFFFCC" }}>
            Group Balance
          </Text>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 28, color: "#D4AF37", marginTop: 4 }}>
            R {group.balance.toLocaleString()}.00
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#FFFFFFAA", marginTop: 4 }}>
            {group.members.length} members
          </Text>
        </View>

        {pendingRequests.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111111", marginBottom: 10 }}>
              Pending Votes
            </Text>
            {pendingRequests.map((wr) => (
              <WithdrawalRequestCard
                key={wr.id}
                request={wr}
                group={group}
                onVote={(choice) => voteOnRequest(group.id, wr.id, choice)}
                onViewDetails={() => onVoteRequest(wr)}
                onRelease={() => onReleaseFunds(wr)}
              />
            ))}
          </View>
        )}

        {approvedRequests.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111111", marginBottom: 10 }}>
              Completed Requests
            </Text>
            {approvedRequests.map((wr) => (
              <CompletedRequestCard key={wr.id} request={wr} />
            ))}
          </View>
        )}

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111111", marginBottom: 10 }}>
            Members
          </Text>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#D5DABF",
              overflow: "hidden",
            }}
          >
            {group.members.map((member, index) => (
              <View
                key={member.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  borderBottomWidth: index < group.members.length - 1 ? 1 : 0,
                  borderBottomColor: "#F0F0F0",
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: member.color,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Text style={{ fontFamily: "Inter-Bold", fontSize: 12, color: "#FFFFFF" }}>
                    {member.initials}
                  </Text>
                </View>
                <Text style={{ flex: 1, fontFamily: "Inter-Medium", fontSize: 14, color: "#111111" }}>
                  {member.name}
                </Text>
                {member.isAdmin && (
                  <View
                    style={{
                      backgroundColor: "#EEF2E4",
                      borderRadius: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: "#6B7220" }}>
                      Admin
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function WithdrawalRequestCard({
  request,
  group,
  onVote,
  onViewDetails,
  onRelease,
}: {
  request: WithdrawalRequest;
  group: Group;
  onVote: (choice: "approve" | "reject") => void;
  onViewDetails: () => void;
  onRelease: () => void;
}) {
  const totalMembers = group.members.length;
  const required = Math.ceil(totalMembers * 0.51);
  const approvalCount = request.approvals.length;
  const progress = Math.min((approvalCount / required) * 100, 100);
  const hasReachedGoal = approvalCount >= required;
  const hasVoted =
    request.approvals.includes(currentUser.id) || request.rejections.includes(currentUser.id);
  const isAdmin = currentUser.isAdmin;

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D5DABF",
        padding: 14,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#EE2023",
            marginRight: 8,
          }}
        />
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#111111" }}>
          Withdrawal Request
        </Text>
      </View>

      <View style={{ backgroundColor: "#F9F9F9", borderRadius: 8, padding: 10, marginBottom: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#666666" }}>
            Requested by: {request.requestedBy.name}
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#666666" }}>
            {request.createdAt}
          </Text>
        </View>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111111", marginTop: 4 }}>
          R {request.amount.toLocaleString()}.00
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#666666", marginTop: 2 }}>
          Purpose: {request.purpose}
        </Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#666666" }}>
            Participation
          </Text>
          <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#111111" }}>
            {approvalCount}/{totalMembers} votes
          </Text>
        </View>
        <View style={{ height: 8, backgroundColor: "#EAEFEA", borderRadius: 4, overflow: "hidden" }}>
          <View
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: hasReachedGoal ? "#6B7220" : "#D4AF37",
              borderRadius: 4,
            }}
          />
        </View>
        {hasReachedGoal && (
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: "#6B7220", marginTop: 3 }}>
            Goal reached
          </Text>
        )}
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {!hasVoted ? (
          <>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onVote("approve")}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 8,
                backgroundColor: "#6B7220",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#FFFFFF" }}>
                Approve
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onVote("reject")}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 8,
                backgroundColor: "#EE2023",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Ionicons name="close-circle-outline" size={16} color="#FFFFFF" />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#FFFFFF" }}>
                Reject
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={{
              flex: 1,
              height: 40,
              borderRadius: 8,
              backgroundColor: "#F0F0F0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#666666" }}>
              You {request.approvals.includes(currentUser.id) ? "approved" : "rejected"}
            </Text>
          </View>
        )}
      </View>

      {isAdmin && hasReachedGoal && request.status === "approved" && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRelease}
          style={{
            marginTop: 10,
            height: 44,
            borderRadius: 8,
            backgroundColor: "#D4AF37",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#FFFFFF" }}>
            Release R {request.amount.toLocaleString()}.00
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function CompletedRequestCard({ request }: { request: WithdrawalRequest }) {
  const isReleased = request.status === "released";
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#D5DABF",
        padding: 14,
        marginBottom: 10,
        opacity: 0.7,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#111111" }}>
            R {request.amount.toLocaleString()}.00 — {request.purpose}
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#666666", marginTop: 2 }}>
            by {request.requestedBy.name} · {request.createdAt}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: isReleased ? "#EAE8BB" : "#EEF2E4",
            borderRadius: 4,
            paddingHorizontal: 6,
            paddingVertical: 3,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 10,
              color: isReleased ? "#8B7000" : "#6B7220",
            }}
          >
            {isReleased ? "Released" : "Approved"}
          </Text>
        </View>
      </View>
    </View>
  );
}

function CreateGroupModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { createGroup } = useGroupsStore();

  const availableMembers = allAvailableMembers.filter((m) => m.id !== currentUser.id);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }
    createGroup(name.trim(), selectedMembers);
    setName("");
    setSelectedMembers([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1, textAlign: "center" }}>
            Create Group
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
          <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 6 }}>
            Group Name
          </Text>
          <TextInput
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#D5DABF",
              paddingHorizontal: 14,
              height: 48,
              fontFamily: "Inter-Regular",
              fontSize: 15,
              color: "#333333",
              marginBottom: 20,
            }}
            placeholder="e.g., Capitec Stokvel"
            placeholderTextColor="#999999"
            value={name}
            onChangeText={setName}
          />

          <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#333333", marginBottom: 10 }}>
            Add Members
          </Text>
          {availableMembers.length === 0 && (
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#D5DABF",
                borderStyle: "dashed",
                padding: 20,
                marginBottom: 8,
              }}
            >
              <Ionicons name="people-outline" size={28} color="#999999" />
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#666666", marginTop: 8 }}>
                No other members available yet
              </Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#999999", marginTop: 2, textAlign: "center" }}>
                You can create the group now and members can be invited later
              </Text>
            </View>
          )}
          {availableMembers.map((member) => {
            const isSelected = selectedMembers.includes(member.id);
            return (
              <TouchableOpacity
                key={member.id}
                activeOpacity={0.85}
                onPress={() => toggleMember(member.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isSelected ? "#EEF2E4" : "#FFFFFF",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: isSelected ? "#6B7220" : "#D5DABF",
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: member.color,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Text style={{ fontFamily: "Inter-Bold", fontSize: 12, color: "#FFFFFF" }}>
                    {member.initials}
                  </Text>
                </View>
                <Text style={{ flex: 1, fontFamily: "Inter-Medium", fontSize: 14, color: "#111111" }}>
                  {member.name}
                </Text>
                {isSelected && <Ionicons name="checkmark-circle" size={22} color="#6B7220" />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCreate}
            style={{
              backgroundColor: "#6B7220",
              borderRadius: 12,
              height: 52,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#FFFFFF" }}>
              Create Group ({selectedMembers.length + 1} members)
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function WithdrawalRequestModal({
  request,
  visible,
  onClose,
  groupId,
}: {
  request: WithdrawalRequest;
  visible: boolean;
  onClose: () => void;
  groupId: string;
}) {
  const { voteOnRequest, getSelectedGroup } = useGroupsStore();
  const group = getSelectedGroup();

  if (!group) return null;

  const totalMembers = group.members.length;
  const required = Math.ceil(totalMembers * 0.51);
  const approvalCount = request.approvals.length;
  const progress = Math.min((approvalCount / required) * 100, 100);
  const hasReachedGoal = approvalCount >= required;
  const hasVoted =
    request.approvals.includes(currentUser.id) || request.rejections.includes(currentUser.id);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1, textAlign: "center" }}>
            Withdrawal Request
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#D5DABF",
              padding: 16,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#EE2023",
                  marginRight: 8,
                }}
              />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111111" }}>
                Withdrawal Request
              </Text>
            </View>

            <View style={{ backgroundColor: "#F9F9F9", borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#666666" }}>
                Requested by: {request.requestedBy.name}
              </Text>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 24, color: "#111111", marginTop: 6 }}>
                R {request.amount.toLocaleString()}.00
              </Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#666666", marginTop: 4 }}>
                Purpose: {request.purpose}
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#666666" }}>
                  Participation Progress
                </Text>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#111111" }}>
                  {approvalCount}/{totalMembers} votes
                </Text>
              </View>
              <View style={{ height: 10, backgroundColor: "#EAEFEA", borderRadius: 5, overflow: "hidden" }}>
                <View
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    backgroundColor: hasReachedGoal ? "#6B7220" : "#D4AF37",
                    borderRadius: 5,
                  }}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#999999" }}>
                  Required: {required} votes (51%)
                </Text>
                {hasReachedGoal && (
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: "#6B7220" }}>
                    Goal reached
                  </Text>
                )}
              </View>
            </View>

            <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#333333", marginBottom: 8 }}>
              Vote Members
            </Text>
            {group.members.map((member) => {
              const didApprove = request.approvals.includes(member.id);
              const didReject = request.rejections.includes(member.id);
              let status = "Not voted";
              let statusColor = "#999999";
              if (didApprove) {
                status = "Approved";
                statusColor = "#6B7220";
              } else if (didReject) {
                status = "Rejected";
                statusColor = "#EE2023";
              }
              return (
                <View
                  key={member.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F0F0F0",
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: member.color,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 10, color: "#FFFFFF" }}>
                      {member.initials}
                    </Text>
                  </View>
                  <Text style={{ flex: 1, fontFamily: "Inter-Medium", fontSize: 13, color: "#111111" }}>
                    {member.name}
                  </Text>
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: statusColor }}>
                    {status}
                  </Text>
                </View>
              );
            })}
          </View>

          {!hasVoted && (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  voteOnRequest(groupId, request.id, "approve");
                  onClose();
                }}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: "#6B7220",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 6,
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#FFFFFF" }}>
                  Approve
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  voteOnRequest(groupId, request.id, "reject");
                  onClose();
                }}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 10,
                  backgroundColor: "#EE2023",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 6,
                }}
              >
                <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#FFFFFF" }}>
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {hasVoted && (
            <View
              style={{
                height: 50,
                borderRadius: 10,
                backgroundColor: "#F0F0F0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#666666" }}>
                You already voted
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function AdminPinModal({
  request,
  visible,
  onClose,
  groupId,
}: {
  request: WithdrawalRequest;
  visible: boolean;
  onClose: () => void;
  groupId: string;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const { releaseFunds } = useGroupsStore();

  const handleRelease = () => {
    if (pin.length !== 4) {
      setError(true);
      return;
    }
    const success = releaseFunds(groupId, request.id, pin);
    if (success) {
      Alert.alert("Success", "Funds have been released successfully!", [{ text: "OK", onPress: onClose }]);
    } else {
      setError(true);
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      if (newPin.length === 4) {
        setTimeout(() => {
          const success = releaseFunds(groupId, request.id, newPin);
          if (success) {
            Alert.alert("Success", "Funds have been released!", [{ text: "OK", onPress: onClose }]);
          } else {
            setError(true);
          }
        }, 300);
      }
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F7F0" }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={24} color="#111111" />
          </TouchableOpacity>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", flex: 1, textAlign: "center" }}>
            Authorize Release
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, justifyContent: "center" }}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#D5DABF",
              padding: 24,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#6B7220",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons name="shield-lock-outline" size={30} color="#FFFFFF" />
            </View>

            <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111111", marginBottom: 4 }}>
              Release R {request.amount.toLocaleString()}.00
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#666666", textAlign: "center", marginBottom: 24 }}>
              Enter PIN to authorize EFT transfer
            </Text>

            <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: error ? "#EE2023" : pin.length > i ? "#6B7220" : "#D5DABF",
                    backgroundColor: pin.length > i ? "#EEF2E4" : "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {pin.length > i && (
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: error ? "#EE2023" : "#6B7220",
                      }}
                    />
                  )}
                </View>
              ))}
            </View>

            {error && (
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#EE2023", marginBottom: 12 }}>
                Incorrect PIN. Try again.
              </Text>
            )}

            <View style={{ width: "100%", gap: 8 }}>
              {[
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
                ["", "0", "del"],
              ].map((row, ri) => (
                <View key={ri} style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                  {row.map((key) => {
                    if (key === "") return <View key={key} style={{ width: 72, height: 52 }} />;
                    if (key === "del") {
                      return (
                        <TouchableOpacity
                          key={key}
                          activeOpacity={0.7}
                          onPress={handlePinDelete}
                          style={{
                            width: 72,
                            height: 52,
                            borderRadius: 10,
                            backgroundColor: "#F0F0F0",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons name="backspace-outline" size={22} color="#333333" />
                        </TouchableOpacity>
                      );
                    }
                    return (
                      <TouchableOpacity
                        key={key}
                        activeOpacity={0.7}
                        onPress={() => handlePinInput(key)}
                        style={{
                          width: 72,
                          height: 52,
                          borderRadius: 10,
                          backgroundColor: "#FFFFFF",
                          borderWidth: 1,
                          borderColor: "#D5DABF",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontFamily: "Inter-Bold", fontSize: 22, color: "#111111" }}>
                          {key}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#999999", marginTop: 16 }}>
              Hint: PIN is 1234
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
