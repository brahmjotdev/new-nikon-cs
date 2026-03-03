import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

// ==============================
// Validators
// ==============================

const noteReturn = v.union(
  v.null(),
  v.object({
    content: v.any(),
    updatedAt: v.number(),
  }),
);

// ==============================
// Query: get note for logged-in user (host schema)
// ==============================

export const getNote = query({
  args: {},
  returns: noteReturn,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;

    const note = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!note) return null;
    return { content: note.content, updatedAt: note.updatedAt };
  },
});

// ==============================
// Mutation: save note (create or update) in host schema
// ==============================

export const saveNote = mutation({
  args: { content: v.any() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const now = Date.now();

    const existing = await ctx.db
      .query("notes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("notes", {
        userId,
        content: args.content,
        updatedAt: now,
      });
    }

    return null;
  },
});

