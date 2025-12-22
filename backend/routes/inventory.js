import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getInventory,
  addInventory,
  editInventory,
  deleteInventory,
} from "../controllers/inventory.js";

const router = express.Router();

router.get("/", auth, getInventory);
router.post("/", auth, addInventory);
router.put("/:id", auth, editInventory);
router.delete("/:id", auth, deleteInventory);

export default router;
