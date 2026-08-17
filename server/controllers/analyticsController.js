import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { ok, asyncHandler } from "../utils/apiResponse.js";

// GET /api/admin/analytics/overview
export const getOverview = asyncHandler(async (req, res) => {
  const [
    totalRevenueAgg,
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: "user" }),
    Product.countDocuments(),
    Order.countDocuments({ orderStatus: { $in: ["Order Placed", "Confirmed"] } }),
    Product.countDocuments({ stock: { $lte: 5 } }),
  ]);

  return ok(res, {
    totalRevenue: totalRevenueAgg[0]?.total || 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    lowStockProducts,
  });
});

// GET /api/admin/analytics/revenue?period=daily|monthly
export const getRevenueOverTime = asyncHandler(async (req, res) => {
  const { period = "monthly" } = req.query;
  const format = period === "daily" ? "%Y-%m-%d" : "%Y-%m";

  const data = await Order.aggregate([
    { $match: { orderStatus: { $ne: "Cancelled" } } },
    {
      $group: {
        _id: { $dateToString: { format, date: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return ok(res, { revenue: data });
});

// GET /api/admin/analytics/sales-by-category
export const getSalesByCategory = asyncHandler(async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: "$productInfo.category",
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        unitsSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);
  return ok(res, { salesByCategory: data });
});

// GET /api/admin/analytics/top-products
export const getTopProducts = asyncHandler(async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        unitsSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: 10 },
  ]);
  return ok(res, { topProducts: data });
});

// GET /api/admin/analytics/new-customers
export const getNewCustomers = asyncHandler(async (req, res) => {
  const data = await User.aggregate([
    { $match: { role: "user" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return ok(res, { newCustomers: data });
});
