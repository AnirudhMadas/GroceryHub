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
    }
},{timestamps : true})

const inventorySchema = mongoose.model("Inventory",itemSchema);

export default inventorySchema;