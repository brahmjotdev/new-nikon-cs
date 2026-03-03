import { AgentResetRequestsBlock } from "@/components/blocks/auth/agent-reset-requests";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <AgentResetRequestsBlock />
      <div>AdminUsersPage (user list)</div>
    </div>
  );
}