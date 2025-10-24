import express from "express";
import { user } from "../dummyUser.js";
import { sessionAuth } from "../middleware/session-auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("GET session way");
});

//dumy get request
router.get("/check", (req, res) => {
    res.send("GET Check session way");
});

// for session way just basic get request
router.get("/dashboard", sessionAuth, (req, res) => {
  res.json({ message: `Welcome ${req.session.user?.username}` });
});

//for post session way example
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  if (req.session.user) {
    return res
      .status(200)
      .json({ message: "Already logged in", user: req.session.user });
  }

  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.session.user = { username };
  return res.status(200).json({ message: "Logged in", user: { username: req.session.user.username } });
});

router.post("/register", (req, res) => {
  res.send("Post register session way");
});

router.post("/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(200).json({ message: "Already logged out" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }

    res.clearCookie("connect.sid"); // default cookie name from express-session
    return res.status(200).json({ message: "Logged out" });
  });
});

export default router;
