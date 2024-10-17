const express = require("express");

const {
  registerUser,
  login,
  logoutUser,
  generate2FACode,
  verify2FACode,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", logoutUser);
router.post("/2fa/generate", generate2FACode);
router.post("/2fa/verify", verify2FACode);

module.exports = router;

// router.post("/login", authController.login);
// router.post("/mfa", authController.verifyMFA);
