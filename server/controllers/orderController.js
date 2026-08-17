import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { ok, fail, asyncHandler } from "../utils/apiResponse.js";

const STAGE_DESCRIPTIONS = {
  "Order Placed": "Your order has been placed successfully.",
  Confirmed: "Your order has been confirmed and is being prepared.",
  Packed: "Your order has been packed and is ready for dispatch.",
  Shipped: "Your order has been shipped.",
  "Out for Delivery": "Your order is out for delivery.",
  Delivered: "Your order has been delivered.",
  Cancelled: "Your order has been cancelled.",
};

// POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, deliveryMethod, paymentMethod } = req.body;
  if (!items || items.length === 0) return fail(res, "No order items", 400);
  if (!shippingAddress) return fail(res, "Shipping address is required", 400);

  let subtotal = 0;
  const orderItems = [];

  for (const { productId, quantity } of items) {
    const product = await Product.findById(productId);
    if (!product) return fail(res, `Product not found: ${productId}`, 404);
    if (quantity > product.stock) {
      return fail(res, `${product.name} has only ${product.stock} in stock`, 400);
    }
    const price = product.discountPrice || product.price;
    subtotal += price * quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price,
      quantity,
    });
  }

  const shippingCost = deliveryMethod === "Express" ? 199 : subtotal >= 999 ? 0 : 79;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCost + tax;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(
    estimatedDelivery.getDate() + (deliveryMethod === "Express" ? 2 : 5)
  );

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    deliveryMethod: deliveryMethod || "Standard",
    paymentMethod: paymentMethod || "COD",
    paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
    subtotal,
    shippingCost,
    tax,
    total,
    estimatedDelivery,
    trackingHistory: [
      { status: "Order Placed", description: STAGE_DESCRIPTIONS["Order Placed"] },
    ],
  });

  // decrement stock
  for (const { productId, quantity } of items) {
    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
  }

  // clear the purchased items from the user's cart
  const user = await User.findById(req.user._id);
  const purchasedIds = items.map((i) => i.productId);
  user.cart = user.cart.filter((i) => !purchasedIds.includes(i.product.toString()));
  await user.save();

  return ok(res, { order }, 201);
});

// GET /api/orders  (current user's orders)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ok(res, { orders });
});

// GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) return fail(res, "Order not found", 404);
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return fail(res, "Not authorized to view this order", 403);
  }
  return ok(res, { order });
});

// GET /api/orders/admin/all  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.orderStatus = status;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit) || 20, 100);

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  return ok(res, {
    orders,
    pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
  });
});

// PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return fail(res, "Order not found", 404);

  order.orderStatus = status;
  if (status === "Delivered") order.paymentStatus = "Paid";
  order.trackingHistory.push({
    status,
    description: STAGE_DESCRIPTIONS[status] || "",
  });
  await order.save();
  return ok(res, { order });
});
