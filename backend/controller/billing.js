import Inventory from "../models/item.js";
import Billing from "../models/billing.js";

const createBilling = async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid billing data" });
    }

    const billingDocs = [];

    for (const item of items) {
      const product = await Inventory.findOne({
        productName: item.productName,
      });

      if (!product || product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `${item.productName} out of stock` });
      }

      product.quantity -= item.quantity;
      await product.save();

      billingDocs.push({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });
    }

    await Billing.insertMany(billingDocs);

    res.status(201).json({ message: "Billing saved successfully" });
  } catch (err) {
    console.error("BILLING ERROR:", err);
    res.status(500).json({ message: "Billing failed" });
  }
};

export default createBilling;
