// routes/jwt-way.routes.js
import express from "express";
import jwt from "jsonwebtoken";
import { user } from "../dummyUser.js";
import { jwtAuth } from "../middleware/jwt-auth.js";

const router = express.Router();

// Sanity
router.get("/", (_req, res) => res.send("GET jwt way"));

// POST /jwt-way/login -> issue token
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  // Compare against your dummy user
  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Create a short-lived token. Never put the password in the payload.
  const token = jwt.sign(
    { sub: username }, // subject (who the token is about)
    process.env.JWT_SECRET, // secret
    { expiresIn: "15m" } // adjust as you like
  );

  return res.status(200).json({
    message: "Logged in",
    token, // client sends this as Authorization: Bearer <token>
  });
});

// GET /jwt-way/dashboard -> protected by token
router.get("/dashboard", jwtAuth, (req, res) => {
  // req.user was set by jwtAuth (decoded payload)
  return res.status(200).json({ message: `Welcome ${req.user.sub}` });
});

export default router;
