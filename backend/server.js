import express from "express";
import "dotenv/config";
import invRouter from "./routes/inventory.js";
import connectDb from "./config/connectionDB.js";


const app = express();
connectDb();
const port = process.env.PORT || 3000;

app.use(express.json());          
app.use(express.urlencoded({ extended: true }));

app.use("/inventory",invRouter)

app.listen(port,(err)=>{
    console.log(`server running on ${port}`);
});
