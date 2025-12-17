import express from "express";
import { createInvoice } from "../controller/billing.js";

const router = express.Router();

router.post("/", createInvoice);

export default router;
