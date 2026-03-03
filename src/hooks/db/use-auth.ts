// ==============================
// Imports
// ==============================

import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/betterAuth/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";

// ==============================
// Shared read helpers (agent + admin) — Convex queries
// ==============================

/** Reactive current user; uses Convex `functions/auth.getCurrentUser`. */
const useCurrentUser = () => {
  return useQuery(api.functions.auth.getCurrentUser);
};

// ==============================
// Admin-only helpers — Convex queries
// ==============================

/** Admin-only: list users via Convex `functions/auth.listUsers`. */
export const useAdminUsers = (paginationOpts: {
  numItems: number;
  cursor: string | null;
}) => {
  return useQuery(api.functions.auth.listUsers, { paginationOpts });
};

/** Admin-only: get a single user by id. Call with null to skip. */
export const useAdminUserById = (userId: Id<"user"> | null) => {
  return useQuery(
    api.functions.auth.getUserById,
    userId !== null && userId !== undefined ? { userId } : "skip",
  );
};

/** Admin-only: get user by name (e.g. for agent reset flow). */
export const useAdminUserByName = (name: string | null) => {
  return useQuery(
    api.functions.auth.getUserByName,
    name !== null && name !== undefined && name.trim() !== "" ? { name } : "skip",
  );
};

/** Admin-only: list pending agent password reset requests. */
export const useAgentPasswordResetRequests = () => {
  return useQuery(api.functions.auth.listAgentPasswordResetRequests, {});
};

// ==============================
// Admin-only mutations
// ==============================

/** Admin-only: approve a user. Returns the Convex mutation runner. */
export const useApproveUser = () => {
  return useMutation(api.functions.auth.approveUser);
};

// ==============================
// Primary hook: agent-focused auth facade
// ==============================

export const useAuth = () => {
  const currentUser = useCurrentUser();
  const isApproved = currentUser?.approved === true;
  const isLoadingUser = currentUser === undefined;
  const markPasswordUpdatedMutation = useMutation(
    api.functions.auth.markPasswordUpdated,
  );

  return {
    // Shared state
    currentUser,
    isApproved,
    isLoadingUser,

    // Session / convenience
    getSession: authClient.getSession,

    // Agent auth actions (email/password for Phase 2)
    registerUser: authClient.signUp.email,
    loginUser: authClient.signIn.email,
    logoutUser: authClient.signOut,
    updateUser: authClient.updateUser,
    requestPasswordReset: authClient.requestPasswordReset,
    changePassword: authClient.changePassword,
    markPasswordUpdated: markPasswordUpdatedMutation,
    getAuthenticatedUser: () => currentUser ?? null,
  };
};

// ==============================
// Admin auth facade
// ==============================
// Security is enforced in Convex (requireAdmin) and Better Auth; hooks only call APIs.
// Use useAdminUsers(paginationOpts) and useAdminUserById(userId) for list/detail.

export const useAdminAuth = () => {
  const approveUserMutation = useApproveUser();
  const resolveRequestMutation = useMutation(
    api.functions.auth.resolveAgentPasswordResetRequest,
  );

  return {
    createUser: authClient.admin.createUser,
    setUserRole: authClient.admin.setRole,
    setUserPassword: authClient.admin.setUserPassword,
    revokeUserSessions: authClient.admin.revokeUserSessions,
    approveUser: approveUserMutation,
    resolveAgentPasswordResetRequest: resolveRequestMutation,
  };
};
