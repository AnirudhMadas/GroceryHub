import express from "express";
import createBilling from "../controller/billing.js";

const router = express.Router();

router.post("/", createBilling);

export default router;
