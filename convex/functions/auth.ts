import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { doc } from "convex-helpers/validators";

import type { Id } from "../betterAuth/_generated/dataModel";
import type { Doc } from "../betterAuth/_generated/dataModel";
import type { QueryCtx } from "../betterAuth/_generated/server";
import schema from "../betterAuth/schema";
import {
  query as betterAuthQuery,
  mutation as betterAuthMutation,
} from "../betterAuth/_generated/server";

const PASSWORD_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ==============================
// Identity mapping (shared)
// ==============================
// Convex identity (from auth provider) uses subject = Better Auth user document _id.
// Lookup path: ctx.auth.getUserIdentity() -> identity.subject -> ctx.db.get(subject as Id<"user">).

// ==============================
// Shared helpers (agent + admin)
// ==============================

/** Throws if not authenticated, banned, or not approved. Returns user doc. Password expiry is added in Phase 3. */
export async function requireUser(ctx: QueryCtx): Promise<Doc<"user">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const userId = identity.subject as Id<"user">;
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.banned === true) {
    throw new Error("Account is banned");
  }
  if (!user.approved) {
    throw new Error("Account pending approval");
  }
  const expiresAt = (user as Doc<"user">).passwordExpiresAt;
  if (typeof expiresAt === "number" && expiresAt <= Date.now()) {
    throw new Error("Password expired");
  }
  return user;
}

// ==============================
// Admin-only helpers
// ==============================

/** Calls requireUser then enforces role === "admin". */
export async function requireAdmin(ctx: QueryCtx): Promise<Doc<"user">> {
  const user = await requireUser(ctx);
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
}

// ==============================
// Queries — shared (agent + admin)
// ==============================

export const getCurrentUser = betterAuthQuery({
  args: {},
  returns: v.union(v.null(), doc(schema, "user")),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const userId = identity.subject as Id<"user">;
    const user = await ctx.db.get(userId);
    return user ?? null;
  },
});

// ==============================
// Queries — admin-only
// ==============================

export const getUserById = betterAuthQuery({
  args: { userId: v.id("user") },
  returns: v.union(v.null(), doc(schema, "user")),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.get(args.userId);
  },
});

/** Admin-only: get user by name (used for agent reset flow to get userId for setUserPassword). */
export const getUserByName = betterAuthQuery({
  args: { name: v.string() },
  returns: v.union(v.null(), doc(schema, "user")),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("user")
      .withIndex("name", (q) => q.eq("name", args.name.trim()))
      .first();
  },
});

const listUsersPaginatedReturns = v.object({
  page: v.array(doc(schema, "user")),
  isDone: v.boolean(),
  continueCursor: v.string(),
});

export const listUsers = betterAuthQuery({
  args: { paginationOpts: paginationOptsValidator },
  returns: listUsersPaginatedReturns,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("user")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// ==============================
// Mutations — shared (agent + admin)
// ==============================

export const markPasswordUpdated = betterAuthMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject as Id<"user">;
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.banned === true) {
      throw new Error("Account is banned");
    }
    if (!user.approved) {
      throw new Error("Account pending approval");
    }
    const now = Date.now();
    await ctx.db.patch(userId, {
      passwordChangedAt: now,
      passwordExpiresAt: now + PASSWORD_EXPIRY_MS,
    });
    return null;
  },
});

// ==============================
// Agent password reset requests (no auth; admin resolves)
// ==============================

const agentResetRequestDoc = v.object({
  _id: v.id("agentPasswordResetRequests"),
  _creationTime: v.number(),
  username: v.string(),
  createdAt: v.number(),
  status: v.union(v.literal("pending"), v.literal("resolved")),
});

/** Public: agent submits username to request password reset; admin will see it and reset for them. */
export const requestAgentPasswordReset = betterAuthMutation({
  args: { username: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const trimmed = args.username.trim();
    if (!trimmed) return null;
    const user = await ctx.db
      .query("user")
      .withIndex("name", (q) => q.eq("name", trimmed))
      .first();
    if (!user || user.role !== "agent") {
      return null;
    }
    await ctx.db.insert("agentPasswordResetRequests", {
      username: trimmed,
      createdAt: Date.now(),
      status: "pending",
    });
    return null;
  },
});

// ==============================
// Mutations — admin-only
// ==============================

export const approveUser = betterAuthMutation({
  args: { userId: v.id("user") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx as unknown as QueryCtx);
    const now = Date.now();
    await ctx.db.patch(args.userId, {
      approved: true,
      passwordChangedAt: now,
      passwordExpiresAt: now + PASSWORD_EXPIRY_MS,
    });
    return null;
  },
});

/** Admin-only: list pending agent password reset requests. */
export const listAgentPasswordResetRequests = betterAuthQuery({
  args: {},
  returns: v.array(agentResetRequestDoc),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("agentPasswordResetRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();
  },
});

/** Admin-only: mark a reset request as resolved (after admin has set the user's password). */
export const resolveAgentPasswordResetRequest = betterAuthMutation({
  args: { requestId: v.id("agentPasswordResetRequests") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx as unknown as QueryCtx);
    await ctx.db.patch(args.requestId, { status: "resolved" });
    return null;
  },
});
