import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login } from "../controllers/auth.js";

const router = express.Router();

/* EMAIL AUTH */
router.post("/signup", signup);
router.post("/login", login);

/* GOOGLE AUTH */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `http://localhost:5173/oauth-success?token=${token}&email=${req.user.email}`
    );
  }
);

export default router;
