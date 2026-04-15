import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./admins";

export const listByCollection = query({
  args: { collectionId: v.id("collections") },
  handler: async (ctx, args) => {
    const artworks = await ctx.db
      .query("artworks")
      .withIndex("by_collection_and_order", (q) =>
        q.eq("collectionId", args.collectionId)
      )
      .order("asc")
      .collect();
    return Promise.all(
      artworks.map(async (a) => ({
        ...a,
        imageUrl: await ctx.storage.getUrl(a.imageId),
        detailUrls: a.detailImageIds
          ? await Promise.all(a.detailImageIds.map((id) => ctx.storage.getUrl(id)))
          : [],
      }))
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const a = await ctx.db
      .query("artworks")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!a) return null;
    return {
      ...a,
      imageUrl: await ctx.storage.getUrl(a.imageId),
      detailUrls: a.detailImageIds
        ? await Promise.all(a.detailImageIds.map((id) => ctx.storage.getUrl(id)))
        : [],
    };
  },
});

export const create = mutation({
  args: {
    collectionId: v.id("collections"),
    title: v.string(),
    description: v.optional(v.string()),
    size: v.optional(v.string()),
    price: v.optional(v.number()),
    sold: v.boolean(),
    imageId: v.id("_storage"),
    detailImageIds: v.optional(v.array(v.id("_storage"))),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("artworks")
      .withIndex("by_collection_and_order", (q) =>
        q.eq("collectionId", args.collectionId)
      )
      .collect();
    const maxOrder = existing.reduce((m, a) => Math.max(m, a.order), -1);
    return await ctx.db.insert("artworks", { ...args, order: maxOrder + 1 });
  },
});

export const update = mutation({
  args: {
    id: v.id("artworks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    size: v.optional(v.string()),
    price: v.optional(v.number()),
    sold: v.optional(v.boolean()),
    imageId: v.optional(v.id("_storage")),
    detailImageIds: v.optional(v.array(v.id("_storage"))),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

export const reorder = mutation({
  args: {
    collectionId: v.id("collections"),
    ids: v.array(v.id("artworks")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    for (let i = 0; i < args.ids.length; i++) {
      await ctx.db.patch(args.ids[i], { order: i });
    }
  },
});
