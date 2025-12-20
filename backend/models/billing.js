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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Billing", billingSchema);

