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
    const body = req.body || {};
    const { productName, quantity, price, category, productImage } = body;

    if (!productName) {
      return res.status(400).json({
        message: "Product Name should not be empty",
      });
    }

    const newItem = await inventorySchema.create({
      productName,
      quantity,
      price,
      category,
      productImage,
    });

    return res.status(201).json(newItem);
  } catch (error) {
    console.error("addInventory error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ---------- EDIT INVENTORY ---------- */
const editInventory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing item id" });
    }

    const updatedItem = await inventorySchema.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    return res.json({
      message: "Item updated",
      item: updatedItem,
    });
  } catch (err) {
    console.error("editInventory error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* ---------- DELETE INVENTORY ---------- */
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    await inventorySchema.findByIdAndDelete(id);

    return res.json({ message: "Item deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getInventory, addInventory, editInventory, deleteInventory };
