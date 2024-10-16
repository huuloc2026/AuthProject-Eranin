const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// Login
router.post("/login", login);
// Register
router.post("/register", (req, res) => {
  res.send("register user");
});

// Xuất router
module.exports = router;

// router.post("/login", authController.login);
// router.post("/mfa", authController.verifyMFA);
