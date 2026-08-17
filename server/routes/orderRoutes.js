import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/admin/all", admin, getAllOrders);
router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", admin, updateOrderStatus);

export default router;
