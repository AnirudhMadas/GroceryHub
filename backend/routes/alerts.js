import express from "express";
import {
  getLowStockAlerts,
  getOutOfStockAlerts,
  reorderItem,
} from "../controllers/alerts.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/low-stock", authMiddleware, getLowStockAlerts);
router.get("/out-of-stock", authMiddleware, getOutOfStockAlerts);
router.post("/reorder/:id", authMiddleware, reorderItem);

export default router;
