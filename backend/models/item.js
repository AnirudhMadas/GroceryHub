import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
    },
    expiryDate: {
    type: Date,
    required: true,
  },
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
},{timestamps : true})

const inventorySchema = mongoose.model("inventory",itemSchema,"inventory");

export default inventorySchema;