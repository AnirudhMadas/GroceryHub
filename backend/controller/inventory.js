import inventorySchema from "../models/item.js";

/* ---------- GET INVENTORY ---------- */
const getInventory = async (req, res) => {
  try {
    const inventory = await inventorySchema.find();
    return res.status(200).json(inventory);
  } catch (error) {
    console.error("getInventory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- ADD INVENTORY ---------- */
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
    });

    return res.status(201).json(newItem);
  } catch (error) {
    console.error("addInventory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- EDIT INVENTORY (🔥 FIXED) ---------- */
const editInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing item id" });
    }

    const updatedItem = await inventorySchema.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,           // ✅ return updated document
        runValidators: true // ✅ validate schema
      }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔥 IMPORTANT: return ONLY the updated product
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("editInventory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- DELETE INVENTORY ---------- */
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await inventorySchema.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
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
