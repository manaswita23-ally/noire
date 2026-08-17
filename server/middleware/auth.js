import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { fail } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) return fail(res, "Not authorized, no token", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return fail(res, "Not authorized", 401);

    req.user = user;
    next();
  } catch (err) {
    return fail(res, "Not authorized, token failed", 401);
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return fail(res, "Admin access required", 403);
};

// Attaches req.user if a valid token is present, but doesn't block guests
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    }
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};
