import Inventory from "../models/item.js";
import Invoice from "../models/invoice.js";

export const createInvoice = async (req, res) => {
  try {
    const { items } = req.body;

    let grandTotal = 0;

    // Update inventory
    for (let item of items) {
      const product = await Inventory.findById(item.productId);

      if (!product || product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `${item.productName} out of stock` });
      }

      product.quantity -= item.quantity;
      await product.save();

      grandTotal += item.price * item.quantity;
    }

    const invoice = await Invoice.create({
      items,
      grandTotal,
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};