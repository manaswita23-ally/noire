import express from "express";
import {
  getProducts,
  getProductById,
  getRecommendations,
  createProduct,
  updateProduct,
  deleteProduct,
  getFacets,
} from "../controllers/productController.js";
import { getProductReviews, createReview } from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/meta/facets", getFacets);
router.get("/:id", getProductById);
router.get("/:id/recommendations", getRecommendations);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", protect, createReview);

router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
