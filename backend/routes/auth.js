import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login } from "../controllers/auth.js";

const router = express.Router();

/* ---------- EMAIL AUTH ---------- */
router.post("/signup", signup);
router.post("/login", login);

/* ---------- GOOGLE AUTH ---------- */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    res.redirect(
      `${FRONTEND_URL}/oauth-success?token=${token}&email=${req.user.email}`
    );
  }
);

export default router;
