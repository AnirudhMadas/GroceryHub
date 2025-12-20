import inventorySchema from "../models/item.js";

/* ---------- GET INVENTORY (USER-SCOPED) ---------- */
const getInventory = async (req, res) => {
  try {
    const inventory = await inventorySchema.find({
      userId: req.userId, // 👈 ONLY CURRENT USER DATA
    });

    return res.status(200).json(inventory);
  } catch (error) {
    console.error("getInventory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- ADD INVENTORY (USER-SCOPED) ---------- */
const addInventory = async (req, res) => {
  try {
    const {
      productName,
      quantity,
      price,
      category,
      productImage,
      expiryDate,
    } = req.body;

    if (!productName || price === undefined) {
      return res.status(400).json({
        message: "Product name and price are required",
      });
    }

    const newItem = await inventorySchema.create({
      productName,
      quantity: Number(quantity) || 0,
      price: Number(price),
      category,
      productImage,
      expiryDate,
      userId: req.userId, // 🔥 ATTACH USER
    });

    return res.status(201).json(newItem);
  } catch (error) {
    console.error("addInventory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- EDIT INVENTORY (USER-SAFE) ---------- */
const editInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing item id" });
    }

    const updatedItem = await inventorySchema.findOneAndUpdate(
      { _id: id, userId: req.userId }, // 🔥 CHECK OWNER
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ message: "Item not found or unauthorized" });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("editInventory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- DELETE INVENTORY (USER-SAFE) ---------- */
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await inventorySchema.findOneAndDelete({
      _id: id,
      userId: req.userId, // 🔥 CHECK OWNER
    });

    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Item not found or unauthorized" });
    }

    return res.status(200).json({
      message: "Item deleted",
      id: deletedItem._id,
    });
  } catch (error) {
    console.error("deleteInventory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export {
  getInventory,
  addInventory,
  editInventory,
  deleteInventory,
};
