import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { ok, fail, asyncHandler } from "../utils/apiResponse.js";

const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avgRating = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: count,
  });
};

// GET /api/products/:id/reviews
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });
  return ok(res, { reviews });
});

// POST /api/products/:id/reviews  { rating, comment, orderId }
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, orderId } = req.body;
  const productId = req.params.id;

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) return fail(res, "You can only review products you purchased", 403);

  const purchased = order.items.some((i) => i.product.toString() === productId);
  if (!purchased) return fail(res, "This product was not part of that order", 403);
  if (order.orderStatus !== "Delivered") {
    return fail(res, "You can review a product once it has been delivered", 403);
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    order: orderId,
    rating,
    comment,
  });

  await recalcProductRating(productId);
  return ok(res, { review }, 201);
});
