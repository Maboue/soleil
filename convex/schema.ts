import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  collections: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    coverImageId: v.optional(v.id("_storage")),
  }).index("by_order", ["order"]),

  artworks: defineTable({
    collectionId: v.id("collections"),
    title: v.string(),
    description: v.optional(v.string()),
    size: v.optional(v.string()),
    price: v.optional(v.number()),
    sold: v.boolean(),
    order: v.number(),
    imageId: v.id("_storage"),
    detailImageIds: v.optional(v.array(v.id("_storage"))),
    slug: v.optional(v.string()),
  })
    .index("by_collection_and_order", ["collectionId", "order"])
    .index("by_slug", ["slug"]),

  siteSettings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
};

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    /** Set to true in Convex → Data → users to allow editing. */
    isAdmin: v.optional(v.boolean()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
  ...applicationTables,
});
