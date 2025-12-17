import express from "express";
import { createInvoice , getInvoices } from "../controller/billing.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/",getInvoices);

export default router;
