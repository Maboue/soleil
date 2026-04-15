import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./admins";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const collections = await ctx.db
      .query("collections")
      .withIndex("by_order")
      .order("asc")
      .collect();
    return Promise.all(
      collections.map(async (c) => ({
        ...c,
        coverUrl: c.coverImageId
          ? await ctx.storage.getUrl(c.coverImageId)
          : null,
      }))
    );
  },
});

export const get = query({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    const c = await ctx.db.get(args.id);
    if (!c) return null;
    return {
      ...c,
      coverUrl: c.coverImageId ? await ctx.storage.getUrl(c.coverImageId) : null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const all = await ctx.db.query("collections").collect();
    const maxOrder = all.reduce((m, c) => Math.max(m, c.order), -1);
    return await ctx.db.insert("collections", {
      title: args.title,
      description: args.description,
      order: maxOrder + 1,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("collections"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // delete all artworks in collection
    const artworks = await ctx.db
      .query("artworks")
      .withIndex("by_collection_and_order", (q) => q.eq("collectionId", args.id))
      .collect();
    for (const a of artworks) {
      await ctx.db.delete(a._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const reorder = mutation({
  args: { ids: v.array(v.id("collections")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    for (let i = 0; i < args.ids.length; i++) {
      await ctx.db.patch(args.ids[i], { order: i });
    }
  },
});
