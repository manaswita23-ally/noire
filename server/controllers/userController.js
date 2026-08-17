import User from "../models/User.js";
import { ok, fail, asyncHandler } from "../utils/apiResponse.js";

// PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();
  return ok(res, { user });
});

// POST /api/users/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  return ok(res, { addresses: user.addresses }, 201);
});

// DELETE /api/users/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  return ok(res, { addresses: user.addresses });
});

// GET/POST /api/users/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  return ok(res, { wishlist: user.wishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  const exists = user.wishlist.some((id) => id.toString() === productId);
  if (exists) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  await user.populate("wishlist");
  return ok(res, { wishlist: user.wishlist });
});

// POST /api/users/recently-viewed  { productId }
export const addRecentlyViewed = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  user.recentlyViewed = user.recentlyViewed.filter((id) => id.toString() !== productId);
  user.recentlyViewed.unshift(productId);
  user.recentlyViewed = user.recentlyViewed.slice(0, 8);
  await user.save();
  await user.populate("recentlyViewed");
  return ok(res, { recentlyViewed: user.recentlyViewed });
});

export const getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("recentlyViewed");
  return ok(res, { recentlyViewed: user.recentlyViewed });
});

// ---- Admin ----

// GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return ok(res, { users });
});

// PUT /api/admin/users/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
    "-password"
  );
  if (!user) return fail(res, "User not found", 404);
  return ok(res, { user });
});

// PUT /api/admin/users/:id/status
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return fail(res, "User not found", 404);
  user.isActive = !user.isActive;
  await user.save();
  return ok(res, { user: { ...user.toObject(), password: undefined } });
});
