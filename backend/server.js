import express from "express";
import "dotenv/config";
import cors from "cors";
import passport from "passport";

import invRouter from "./routes/inventory.js";
import authRouter from "./routes/auth.js";
import billingRouter from "./routes/billing.js";
import reportsRoutes from "./routes/reports.js";
import alertsRouter from "./routes/alerts.js";

import connectDb from "./config/connectionDB.js";
import "./config/passport.js";

const app = express();
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/api/inventory", invRouter);
app.use("/api/auth", authRouter);
app.use("/api/billing", billingRouter);
app.use("/api/reports", reportsRoutes);
app.use("/api/alerts", alertsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
