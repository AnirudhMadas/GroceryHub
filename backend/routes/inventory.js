import express from "express";
import {getInventory,addInventory,editInventory,deleteInventory} from "../controller/inventory.js";

const router = express.Router();

router.get("/",getInventory);
router.post("/",addInventory);
router.put("/:id",editInventory);
router.delete("/:id",deleteInventory);

export default router;