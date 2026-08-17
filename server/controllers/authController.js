import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { ok, fail, asyncHandler } from "../utils/apiResponse.js";

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  addresses: user.addresses,
  wishlist: user.wishlist,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return fail(res, "All fields are required", 400);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return fail(res, "Email is already registered", 400);

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  return ok(res, { user: publicUser(user), token }, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, "Email and password are required", 400);

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return fail(res, "Invalid email or password", 401);
  }
  if (!user.isActive) return fail(res, "Account is disabled", 403);

  const token = generateToken(user._id);
  return ok(res, { user: publicUser(user), token });
});

export const getMe = asyncHandler(async (req, res) => {
  return ok(res, { user: publicUser(req.user) });
});
