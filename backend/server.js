import express from "express";
import "dotenv/config";
import invRouter from "./routes/inventory.js";
import authRouter from "./routes/auth.js";
import billingRouter from "./routes/billing.js";
import connectDb from "./config/connectionDB.js";
import cors from "cors";

const app = express();
connectDb();
const port = process.env.PORT || 5000;

app.use(express.json());          
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use("/api/inventory", invRouter);
app.use("/api/auth",authRouter);
app.use("/api/billing",billingRouter);

app.listen(port,(err)=>{
    console.log(`server running on ${port}`);
});
