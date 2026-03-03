import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

//==============================
// Tables
//==============================

export const tables = {
  //==============================
  // Shared content
  //==============================
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    productTypeId: v.id("productTypes"),
    productImagesIds: v.array(v.id("productImages")),
    productSpecificationsIds: v.array(v.id("productSpecifications")),
    status: v.union(v.literal("draft"), v.literal("published")),
    updatedAt: v.number(),
  }),
  productTypes: defineTable({
    name: v.string(),
    parentId: v.optional(v.id("productTypes")),
    updatedAt: v.number(),
  }),
  productImages: defineTable({
    productId: v.id("products"),
    imageUrl: v.string(),
    facing: v.array(
      v.union(
        v.literal("front"),
        v.literal("left"),
        v.literal("back"),
        v.literal("right"),
        v.literal("top"),
        v.literal("bottom"),
        v.literal("other"),
      ),
    ),
    imageIndex: v.number(),
    updatedAt: v.number(),
  }),
  productSpecifications: defineTable({
    productId: v.id("products"),
    specificationKey: v.string(),
    specificationValue: v.any(),
    updatedAt: v.number(),
  }),
  troubleshooting: defineTable({
    question: v.string(),
    answer: v.string(),
    troubleshootingCategoryId: v.id("troubleshootingCategories"),
    updatedAt: v.number(),
  }),
  troubleshootingCategories: defineTable({
    name: v.string(),
    parentId: v.optional(v.id("troubleshootingCategories")),
    updatedAt: v.number(),
  }),
  cameraMenu: defineTable({
    name: v.string(), // network menu
    updatedAt: v.number(),
  }),
  cameraMenuItems: defineTable({
    name: v.string(), // connect to smartphone
    parentId: v.optional(v.id("cameraMenuItems")),
    updatedAt: v.number(),
  }),
  errorCodes: defineTable({
    name: v.string(),
    reason: v.any(),
    menuItemId: v.id("cameraMenuItems"),
    updatedAt: v.number(),
  }),
  servicePeriodList: defineTable({
    productId: v.id("products"),
    endPeriod: v.number(),
    updatedAt: v.number(),
  }),
  guides: defineTable({
    name: v.string(),
    content: v.any(),
    guideCategoryId: v.id("guideCategories"),
    updatedAt: v.number(),
  }),
  guideCategories: defineTable({
    name: v.string(),
    parentId: v.optional(v.id("guideCategories")),
    updatedAt: v.number(),
  }),
  //==============================
  // User specific content
  //==============================
  templates: defineTable({
    userId: v.string(), // betterAuth user id (string)
    name: v.string(),
    content: v.any(),
    templateCategoryId: v.id("templateCategories"),
    updatedAt: v.number(),
  }),
  templateCategories: defineTable({
    userId: v.string(), // betterAuth user id (string)
    name: v.string(),
    parentId: v.optional(v.id("templateCategories")),
    updatedAt: v.number(),
  }),
  notes: defineTable({
    userId: v.string(), // betterAuth user id (string)
    content: v.any(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
  suggestEdits: defineTable({
    userId: v.string(), // betterAuth user id (string)
    content: v.any(),
    page: v.union(
      v.literal("products"),
      v.literal("troubleshooting"),
      v.literal("cameraMenu"),
      v.literal("servicePeriodList"),
      v.literal("guides"),
      v.literal("learn"),
      v.literal("templates"),
      v.literal("notes"),
    ),
    status: v.union(
      v.literal("submitted"),
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("approved"),
      v.literal("in-progress"),
      v.literal("delivered"),
      v.literal("rejected"),
    ),
    comments: v.any(),
    updatedAt: v.number(),
  }),
};

//==============================
// Schemas
//==============================

export default defineSchema({
  ...tables,
});
