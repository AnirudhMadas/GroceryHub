import express from "express";
import {
  getLowStockAlerts,
  getOutOfStockAlerts,
  reorderItem,
} from "../controller/alerts.js";

const router = express.Router();

router.get("/low-stock", getLowStockAlerts);
router.get("/out-of-stock", getOutOfStockAlerts);
router.post("/reorder/:id", reorderItem);

export default router;
