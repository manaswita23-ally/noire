import express from "express";
import {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCollections);
router.get("/:slug", getCollectionBySlug);
router.post("/", protect, admin, createCollection);
router.put("/:id", protect, admin, updateCollection);
router.delete("/:id", protect, admin, deleteCollection);

export default router;
