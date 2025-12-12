import inventorySchema from "../models/item.js";

const getInventory = async (req,res)=>{
    const inventory = await inventorySchema.find();
    return res.json(inventory);
}

const addInventory = async (req,res)=>{
    const body = req.body || {};
    const {productName,quantity,price,category,productImage} = body;
    if(!productName){
        res.json({message:"Product Name should not be Empty"});
    }
    const newItem = await inventorySchema.create({
        productName,quantity,price,category,productImage
    })
    return res.json(newItem);
}

const editInventory = async (req, res) => {
  try {
    const body = req.body || {};
    const { productName, quantity, price, category, productImage } = body;

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Missing item id in route params" });
    }
    const update = {};
    if (productName !== undefined) update.productName = productName;
    if (quantity !== undefined) update.quantity = quantity;
    if (price !== undefined) update.price = price;
    if (category !== undefined) update.category = category;
    if (productImage !== undefined) update.productImage = productImage;

    const updatedItem = await inventorySchema.findByIdAndUpdate(id, update, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.json({ message: "Item updated", item: updatedItem });
  } catch (err) {
    console.error("editInventory error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const deleteInventory = (req,res)=>{
    res.json({message:"hello"});
}

export  {getInventory,addInventory,editInventory,deleteInventory};
