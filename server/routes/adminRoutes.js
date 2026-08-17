import express from "express";
import { protect, admin } from "../middleware/auth.js";
import { getAllUsers, updateUserRole, toggleUserStatus } from "../controllers/userController.js";
import {
  getOverview,
  getRevenueOverTime,
  getSalesByCategory,
  getTopProducts,
  getNewCustomers,
} from "../controllers/analyticsController.js";

const router = express.Router();
router.use(protect, admin);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/status", toggleUserStatus);

router.get("/analytics/overview", getOverview);
router.get("/analytics/revenue", getRevenueOverTime);
router.get("/analytics/sales-by-category", getSalesByCategory);
router.get("/analytics/top-products", getTopProducts);
router.get("/analytics/new-customers", getNewCustomers);

export default router;
