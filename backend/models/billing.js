import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    productName: String,
    quantity: Number,
    price: Number,
    total: Number,
    billedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Billing", billingSchema);

