import express from "express";
import cors from "cors";
import "dotenv/config";
import passport from "passport";


import connectDb from "../config/connectionDB.js";
import invRouter from "./routes/inventory.js";
import authRouter from "./routes/auth.js";
import billingRouter from "./routes/billing.js";
import reportsRoutes from "./routes/reports.js";
import alertsRouter from "./routes/alerts.js";
import "./config/passport.js";

const app = express();

connectDb();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("GroceryHub Backend Running");
});

app.use(passport.initialize());

app.use("/api/inventory", invRouter);
app.use("/api/auth", authRouter);
app.use("/api/billing", billingRouter);
app.use("/api/reports", reportsRoutes);
app.use("/api/alerts", alertsRouter);

export default app; // 🚨 VERY IMPORTANT
