import express from "express";
import cors from "cors";
import passport from "passport";
import "dotenv/config";

import connectDb from "./config/connectionDB.js";

import invRouter from "./routes/inventory.js";
import authRouter from "./routes/auth.js";
import billingRouter from "./routes/billing.js";
import reportsRoutes from "./routes/reports.js";
import alertsRouter from "./routes/alerts.js";

import "./config/passport.js";

const app = express();

/* ---------- DB ---------- */
connectDb();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-name.vercel.app"
  ],
  credentials: true
}));


app.use(passport.initialize());

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("GroceryHub Backend Running 🚀");
});

app.use("/api/inventory", invRouter);
app.use("/api/auth", authRouter);
app.use("/api/billing", billingRouter);
app.use("/api/reports", reportsRoutes);
app.use("/api/alerts", alertsRouter);

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
