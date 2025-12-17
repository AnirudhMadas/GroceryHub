import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
      },
      productName: String,
      price: Number,
      quantity: Number,
      total: Number,
    },
  ],
  grandTotal: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Invoice", invoiceSchema);
