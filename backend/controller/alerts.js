import inventorySchema from "../models/item.js";

const LOW_STOCK_LIMIT = 10;

/* ---------- LOW STOCK (USER-SCOPED) ---------- */
export const getLowStockAlerts = async (req, res) => {
  try {
    const items = await inventorySchema.find({
      userId: req.userId, // 🔥 USER FILTER
      quantity: { $gt: 0, $lte: LOW_STOCK_LIMIT },
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("Low stock error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ---------- OUT OF STOCK (USER-SCOPED) ---------- */
export const getOutOfStockAlerts = async (req, res) => {
  try {
    const items = await inventorySchema.find({
      userId: req.userId, // 🔥 USER FILTER
      quantity: 0,
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("Out stock error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ---------- REORDER (USER-SAFE) ---------- */
export const reorderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await inventorySchema.findOne({
      _id: id,
      userId: req.userId, // 🔥 OWNERSHIP CHECK
    });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or unauthorized" });
    }

    res.status(200).json({
      message: "Reorder initiated",
      productName: item.productName,
      category: item.category || "",
    });
  } catch (error) {
    console.error("Reorder error:", error);
    res.status(500).json({ message: error.message });
  }
};
