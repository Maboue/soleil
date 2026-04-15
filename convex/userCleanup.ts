import { internalMutation } from "./_generated/server";

/** Run after deleting rows from `users`: removes auth rows that still point at missing users. */
export const sweepOrphanedAuth = internalMutation({
  args: {},
  handler: async (ctx) => {
    const validUserIds = new Set(
      (await ctx.db.query("users").collect()).map((u) => u._id),
    );

    for (const session of await ctx.db.query("authSessions").collect()) {
      if (validUserIds.has(session.userId)) continue;
      for (const t of await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionIdAndParentRefreshTokenId", (q) =>
          q.eq("sessionId", session._id),
        )
        .collect()) {
        await ctx.db.delete(t._id);
      }
      await ctx.db.delete(session._id);
    }

    for (const vdoc of await ctx.db.query("authVerifiers").collect()) {
      if (!vdoc.sessionId) continue;
      const s = await ctx.db.get(vdoc.sessionId);
      if (s === null) await ctx.db.delete(vdoc._id);
    }

    for (const acc of await ctx.db.query("authAccounts").collect()) {
      if (validUserIds.has(acc.userId)) continue;
      for (const c of await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", acc._id))
        .collect()) {
        await ctx.db.delete(c._id);
      }
      await ctx.db.delete(acc._id);
    }

    for (const t of await ctx.db.query("authRefreshTokens").collect()) {
      const s = await ctx.db.get(t.sessionId);
      if (s === null) await ctx.db.delete(t._id);
    }

    for (const c of await ctx.db.query("authVerificationCodes").collect()) {
      const a = await ctx.db.get(c.accountId);
      if (a === null) await ctx.db.delete(c._id);
    }

    return { ok: true as const };
  },
});
