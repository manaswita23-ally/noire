import slugify from "slugify";
import Collection from "../models/Collection.js";
import { ok, fail, asyncHandler } from "../utils/apiResponse.js";

export const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find().sort({ featured: -1, createdAt: -1 });
  return ok(res, { collections });
});

export const getCollectionBySlug = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({ slug: req.params.slug }).populate("products");
  if (!collection) return fail(res, "Collection not found", 404);
  return ok(res, { collection });
});

export const createCollection = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data.slug) data.slug = slugify(data.name, { lower: true, strict: true });
  const collection = await Collection.create(data);
  return ok(res, { collection }, 201);
});

export const updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!collection) return fail(res, "Collection not found", 404);
  return ok(res, { collection });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndDelete(req.params.id);
  if (!collection) return fail(res, "Collection not found", 404);
  return ok(res, { message: "Collection deleted" });
});
