import express from "express";
import {
  updateProfile,
  addAddress,
  deleteAddress,
  getWishlist,
  toggleWishlist,
  addRecentlyViewed,
  getRecentlyViewed,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.put("/profile", updateProfile);
router.post("/addresses", addAddress);
router.delete("/addresses/:addressId", deleteAddress);

router.get("/wishlist", getWishlist);
router.post("/wishlist", toggleWishlist);

router.get("/recently-viewed", getRecentlyViewed);
router.post("/recently-viewed", addRecentlyViewed);

export default router;
