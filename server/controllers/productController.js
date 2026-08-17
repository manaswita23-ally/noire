import slugify from "slugify";
import Product from "../models/Product.js";
import { ok, fail, asyncHandler } from "../utils/apiResponse.js";

// GET /api/products  (supports search, filters, sort, pagination)
export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    collection,
    mood,
    minPrice,
    maxPrice,
    rating,
    inStock,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (collection) query.collections = collection;
  if (mood) query.moods = mood;
  if (rating) query.rating = { $gte: Number(rating) };
  if (inStock === "true") query.stock = { $gt: 0 };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    priceLowHigh: { price: 1 },
    priceHighLow: { price: -1 },
    topRated: { rating: -1 },
    popular: { reviewCount: -1 },
    featured: { featured: -1, createdAt: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.featured;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit) || 12, 50);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortBy).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  return ok(res, {
    products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  });
});

// GET /api/products/:id  (id or slug)
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const product = await Product.findOne(isObjectId ? { _id: id } : { slug: id });
  if (!product) return fail(res, "Product not found", 404);
  return ok(res, { product });
});

// GET /api/products/:id/recommendations
export const getRecommendations = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return fail(res, "Product not found", 404);

  const priceMin = product.price * 0.6;
  const priceMax = product.price * 1.6;

  const [completeTheLook, youMayAlsoLike] = await Promise.all([
    Product.find({
      _id: { $ne: product._id },
      $or: [{ collections: { $in: product.collections } }, { tags: { $in: product.tags } }],
    }).limit(4),
    Product.find({
      _id: { $ne: product._id },
      category: product.category,
      price: { $gte: priceMin, $lte: priceMax },
    }).limit(8),
  ]);

  return ok(res, { completeTheLook, youMayAlsoLike });
});

// POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data.slug) data.slug = slugify(data.name, { lower: true, strict: true });
  const product = await Product.create(data);
  return ok(res, { product }, 201);
});

// PUT /api/products/:id (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  if (data.name && !data.slug) data.slug = slugify(data.name, { lower: true, strict: true });
  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) return fail(res, "Product not found", 404);
  return ok(res, { product });
});

// DELETE /api/products/:id (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return fail(res, "Product not found", 404);
  return ok(res, { message: "Product deleted" });
});

// GET /api/products/meta/facets  (categories, moods for filters)
export const getFacets = asyncHandler(async (req, res) => {
  const [categories, moods, brands] = await Promise.all([
    Product.distinct("category"),
    Product.distinct("moods"),
    Product.distinct("brand"),
  ]);
  return ok(res, { categories, moods, brands });
});
