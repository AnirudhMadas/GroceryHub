import express from "express";
import createBilling from "../controllers/billing.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBilling);

export default router;
