import User from "../models/User.js";
import Product from "../models/Product.js";
import { ok, fail, asyncHandler } from "../utils/apiResponse.js";

// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  return ok(res, { cart: user.cart });
});

// POST /api/cart  { productId, quantity }
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return fail(res, "Product not found", 404);

  const user = await User.findById(req.user._id);
  const existing = user.cart.find((item) => item.product.toString() === productId);

  const desiredQty = existing ? existing.quantity + Number(quantity) : Number(quantity);
  if (desiredQty > product.stock) return fail(res, "Not enough stock available", 400);

  if (existing) {
    existing.quantity = desiredQty;
  } else {
    user.cart.push({ product: productId, quantity: desiredQty });
  }
  await user.save();
  await user.populate("cart.product");
  return ok(res, { cart: user.cart });
});

// PUT /api/cart/:productId  { quantity }
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) return fail(res, "Product not found", 404);
  if (quantity > product.stock) return fail(res, "Not enough stock available", 400);

  const user = await User.findById(req.user._id);
  const item = user.cart.find((i) => i.product.toString() === req.params.productId);
  if (!item) return fail(res, "Item not in cart", 404);

  item.quantity = quantity;
  await user.save();
  await user.populate("cart.product");
  return ok(res, { cart: user.cart });
});

// DELETE /api/cart/:productId
export const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
  await user.save();
  await user.populate("cart.product");
  return ok(res, { cart: user.cart });
});

// POST /api/cart/merge  { items: [{ productId, quantity }] }  -- merge guest cart on login
export const mergeCart = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;
  const user = await User.findById(req.user._id);

  for (const { productId, quantity } of items) {
    const product = await Product.findById(productId);
    if (!product) continue;
    const existing = user.cart.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      user.cart.push({ product: productId, quantity: Math.min(quantity, product.stock) });
    }
  }
  await user.save();
  await user.populate("cart.product");
  return ok(res, { cart: user.cart });
});
