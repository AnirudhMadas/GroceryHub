import express from "express";
import {
  getInventory,
  addInventory,
  editInventory,
  deleteInventory,
} from "../controller/inventory.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 ALL ROUTES PROTECTED
router.get("/", authMiddleware, getInventory);
router.post("/", authMiddleware, addInventory);
router.put("/:id", authMiddleware, editInventory);
router.delete("/:id", authMiddleware, deleteInventory);

export default router;
